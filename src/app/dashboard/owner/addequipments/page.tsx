"use client"

import React, { useState, type FormEvent, type SyntheticEvent } from 'react';
import {
  TextField, Label, Input, FieldError,
  Select, ListBox, Button, TextArea,
} from "@heroui/react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { authClient } from "@/lib/auth-client";
import { ImageIcon } from "lucide-react";

// ---------- Types ----------
type ProductStatus = "Pending" | "Approved" | "Rejected";

interface ProductFormValues {
  title: string;
  stock: string;
  category: string;
  price: string;
  condition: string;
  description: string;
  imageUrl: string;
}

interface ProductPayload {
  title: string;
  stock: number;
  category: string;
  price: number;
  condition: string;
  description: string;
  image: string;
  status: ProductStatus;
  ownerId?: string;
  ownerName?: string;
  ownerEmail?: string;
}

type ToastPosition =
  | 'top-left' | 'top-right' | 'top-center'
  | 'bottom-left' | 'bottom-right' | 'bottom-center';

interface ToastOptions {
  duration?: number;
  position?: ToastPosition;
}

interface ApiResponse {
  success?: boolean;
  message?: string;
  insertedId?: string;
}

// ---------- Component ----------
const OwnerAddEquipmentPage = (): React.ReactElement => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imageError, setImageError] = useState<boolean>(false);

  // ✅ Derived values — এগুলোই আগে missing ছিল
  const isValidImageUrl: boolean = /^https?:\/\//.test(imageUrl);
  const isInvalid: boolean = imageUrl.length > 0 && !isValidImageUrl;
  const showPreview: boolean = isValidImageUrl && !imageError && imageUrl.length > 0;

  // ✅ Handlers
  const handleImageValueChange = (value: string): void => {
    setImageUrl(value);
    setImageError(false); // নতুন URL দিলে error reset
  };

  const handleImageError = (): void => {
    setImageError(true);
  };

  const handleImageLoad = (): void => {
    setImageError(false); // ✅ নতুন করে define করা হলো
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const form = e.currentTarget;

    const formData = new FormData(form);
    const formValues = Object.fromEntries(
      formData.entries(),
    ) as unknown as ProductFormValues;
    console.log(formValues, "formvalues");

    const { data: session } = await authClient.getSession();
    const userId = session?.user?.id;
    const userName = session?.user?.name;
    const userEmail = session?.user?.email;

    const product: ProductPayload = {
      title: formValues.title,
      stock: Number(formValues.stock) || 0,
      category: formValues.category,
      price: Number(formValues.price) || 0,
      condition: formValues.condition,
      description: formValues.description,
      image: imageUrl,
      status: "Pending",
      ownerId: userId,
      ownerName: userName,
      ownerEmail: userEmail,
    };
    console.log("Equipment with userId", product);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/owner/addequipments`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      },
    );
 const productData: ApiResponse = await res.json();
    console.log('data after post', productData);
   
    const Ttoast: ToastOptions = {
      duration: 3000,
      position: 'top-center',
    };

    if (res.ok) {
      toast.success('Product added, see my-product-list', Ttoast);
      form.reset();
      setImageUrl('');
      setImageError(false);
    }
  };


  return (
    <div>
      <h1 className="text-2xl font-bold text-blue-800 text-center my-2">
        Add Equipments
      </h1>
      <div className="formdata border-2 shadow-lg w-3xl bg-slate-100 ml-35">
        <form
          onSubmit={onSubmit}
          className="p-10 space-y-4 justify-center items-center w-3xl"
        >
          <ToastContainer />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Title */}
            <div className="md:col-span-2">
              <TextField name="title" isRequired>
                <Label>Equipment Title</Label>
                <Input
                  placeholder="Enter your Equipment name"
                  className="rounded-2xl placeholder:text-slate-400"
                />
                <FieldError />
              </TextField>
            </div>

            {/* Stock */}
            <TextField name="stock" isRequired>
              <Label>Stock Quantity</Label>
              <Input
                type="number"
                placeholder="100"
                className="rounded-2xl placeholder:text-slate-400 w-full text-center"
              />
              <FieldError />
            </TextField>

            {/* Category */}
            <div>
              <Select
                name="category"
                isRequired
                placeholder="Select category"
                className="w-full rounded-2xl"
              >
                <Label className="p-3">Category</Label>
                <Select.Trigger className="rounded-2xl">
                  <Select.Value className="text-slate-400" />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox>
                    <ListBox.Item id="laptops" textValue="heavy equipment">
                      Heavy Equipment <ListBox.ItemIndicator />
                    </ListBox.Item>
                    <ListBox.Item id="mobile phones" textValue="construction equipment">
                      Construction Equipment <ListBox.ItemIndicator />
                    </ListBox.Item>
                    <ListBox.Item id="vehicles" textValue="power tools">
                      Power Tools <ListBox.ItemIndicator />
                    </ListBox.Item>
                    <ListBox.Item id="home appliances" textValue="aerial equipment">
                      Aerial Equipment <ListBox.ItemIndicator />
                    </ListBox.Item>
                    <ListBox.Item id="furniture" textValue="event equipment">
                      Event Equipment <ListBox.ItemIndicator />
                    </ListBox.Item>
                    <ListBox.Item id="sports" textValue="photography & video">
                      Photography & Video <ListBox.ItemIndicator />
                    </ListBox.Item>
                  </ListBox>
                </Select.Popover>
              </Select>
            </div>

            {/* Price */}
            <TextField name="price" isRequired>
              <Label>Price (USD)</Label>
              <Input
                type="number"
                placeholder="1000"
                className="rounded-2xl placeholder:text-slate-400"
              />
              <FieldError />
            </TextField>

            {/* Condition */}
            <div>
              <Select
                name="condition"
                isRequired
                className="rounded-2xl placeholder:text-slate-800"
                placeholder="Select condition"
              >
                <Label>Condition</Label>
                <Select.Trigger className="rounded-2xl flex">
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox>
                    <ListBox.Item id="used" textValue="good">
                      Good <ListBox.ItemIndicator />
                    </ListBox.Item>
                    <ListBox.Item id="like new" textValue="better">
                      Better <ListBox.ItemIndicator />
                    </ListBox.Item>
                    <ListBox.Item id="refurbished" textValue="excellent">
                      Excellent <ListBox.ItemIndicator />
                    </ListBox.Item>
                  </ListBox>
                </Select.Popover>
              </Select>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <TextField name="description" isRequired>
                <Label>Product Description</Label>
                <TextArea
                  placeholder="Enter your product description"
                  className="rounded-2xl placeholder:text-slate-400"
                  rows={4}
                />
                <FieldError />
              </TextField>
            </div>

            {/* Image URL + Preview */}
              <div className="md:col-span-2">
              <div className="space-y-2">
                {/* <Label>Image Url</Label>
                <Input
                  id="event-image"
                  name="imageUrl"
                  type="url"
                  required
                  // label="Image URL"
                  placeholder="https://..."
                  value={imageUrl}
                  className='w-full'
                  // onValueChange={handleImageValueChange}
                   onChange={(e) => handleImageValueChange(e.target.value)}
                  isInvalid={isInvalid || imageError}
                  errorMessage={
                    isInvalid
                      ? "Give correct image URL "
                      : imageError
                      ? "Image could not be loaded"
                      : undefined
                  }
                  labelPlacement="outside"
                  classNames={{
                    label: "text-lg font-bold text-foreground ",
                    inputWrapper: "bg-default-100",
                  }}
                /> */}
     <TextField
      name="imageUrl"
      isRequired
      isInvalid={isInvalid || imageError}
    >
      <Label>Image URL</Label>
      <Input
        id="event-image"
        type="url"
        placeholder="https://..."
        value={imageUrl}
        className="w-full bg-default-100"   // classNames এর বদলে className
        onChange={(e) => handleImageValueChange(e.target.value)}
      />
      <FieldError>
        {isInvalid
          ? "Give correct image URL"
          : imageError
          ? "Image could not be loaded"
          : undefined}
      </FieldError>
    </TextField>



               

                {/* Preview */}
                <div className="mt-3 flex aspect-video w-full items-center justify-center overflow-hidden rounded-lg border-2 border-default-300 bg-default-100/40">
                  {showPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imageUrl}
                      alt="Product image preview"
                      className="h-full w-full object-cover"
                      onError={handleImageError}
                      onLoad={handleImageLoad}
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-1.5 text-default-500">
                      <ImageIcon className="size-6" />
                      <span className="text-sm">
                        {imageError
                          ? "Image could not be loaded"
                          : imageUrl.length > 0
                          ? "URL টা valid না"
                          : "Image preview"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div> 


          </div>

          {/* Submit */}
          <Button
            type="submit"
            variant="outline"
            className="rounded-2xl w-full bg-cyan-500 text-white font-bold"
          >
            Add Equipment
          </Button>
        </form>
      </div>
    </div>
  );
};

export default OwnerAddEquipmentPage;





