"use client";

import React, { useState, type FormEvent, type ChangeEvent } from "react";
// import { useRouter } from "next/navigation";
import {
  Button,
  Input,
  ListBox,
  Label,
  Select,
  FieldError,
  Modal,
  Surface,
  TextField,
  TextArea,
} from "@heroui/react";
import { toast } from "react-toastify";
import { FaRegEdit } from "react-icons/fa";
import { ImageIcon } from "lucide-react";

/* ---------- types ---------- */
export interface UpdateModalProduct {
  _id: string;
  title?: string;
  stock?: number;
  image?: string;
  imageUrl?: string;
  equipmentImage?: string;
  price?: number;
  category?: string;
  condition?: string;
  rentalType?: string;
  description?: string;
}

interface UpdateModalProps {
  product: UpdateModalProduct;
}

interface UpdatePayload {
  title: string;
  stock: number;
  price: number;
  image: string;
  category: string;
  condition: string;
  rentalType: string;
  description: string;
}

/* ---------- component ---------- */
const UpdateModal = ({ product }: UpdateModalProps) => {
//   const router = useRouter();

  const {
    _id,
    title,
    stock,
    image,
    imageUrl: fallbackImageUrl,
    equipmentImage,
    price,
    category,
    condition,
    rentalType,
    description,
  } = product;

  // resolve initial image
  const initialImage = image ?? equipmentImage ?? fallbackImageUrl ?? "";

  // image preview state
  const [imageUrl, setImageUrl] = useState<string>(initialImage);
  const [imageError, setImageError] = useState<boolean>(false);
  const [isInvalid, setIsInvalid] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(Boolean(initialImage));
  const [saving, setSaving] = useState<boolean>(false);

  const handleImageValueChange = (value: string) => {
    setImageUrl(value);
    setImageError(false);
    const valid = /^https?:\/\/.+/i.test(value);
    setIsInvalid(!valid);
    setShowPreview(true);
  };

  const handleImageInputChange = (
    e: ChangeEvent<HTMLInputElement>
  ): void => {
    handleImageValueChange(e.target.value);
  };

  const handleImageError = (): void => {
    setImageError(true);
    setShowPreview(false);
  };

  const handleImageLoad = (): void => {
    setImageError(false);
    setShowPreview(true);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!_id) {
      toast.error("Product id missing");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const raw = Object.fromEntries(formData.entries()) as Record<
      string,
      FormDataEntryValue
    >;

    const payload: UpdatePayload = {
      title: String(raw.title ?? ""),
      stock: Number(raw.stock),
      price: Number(raw.price),
      image: String(raw.image ?? ""),
      category: String(raw.category ?? ""),
      condition: String(raw.condition ?? ""),
      rentalType: String(raw.rentalType ?? ""),
      description: String(raw.description ?? ""),
    };

    if (Number.isNaN(payload.price) || Number.isNaN(payload.stock)) {
      toast.error("Price and Stock must be valid numbers");
      return;
    }

    if (!payload.image) {
      toast.error("Image URL is required");
      return;
    }

    try {
      setSaving(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/owner/${_id}`,
        {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

    //   await res.json();
const data = await res.json()
console.log( 'data after post',data);
    
 window.location.reload();
 toast.success("Product updated successfully ✅", {
        autoClose: 1000,
        position: "bottom-left",
      });
    //   router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Update failed ❌", {
        autoClose: 1000,
        position: "bottom-left",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Modal>
        <Button variant="secondary">
          <FaRegEdit />
        </Button>
        <Modal.Backdrop>
          <Modal.Container placement="auto">
            <Modal.Dialog className="sm:max-w-2xl">
              <Modal.CloseTrigger />
              <Modal.Header>
                <Modal.Icon className="bg-accent-soft text-accent-soft-foreground"></Modal.Icon>
                <Modal.Heading>Update Equipment</Modal.Heading>
              </Modal.Header>
              <Modal.Body className="p-6">
                <Surface variant="default">
                  <form onSubmit={onSubmit} className="p-2 space-y-8 m-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Title */}
                      <div className="md:col-span-2">
                        <TextField name="title" isRequired defaultValue={title}>
                          <Label>Equipment Title</Label>
                          <Input
                            placeholder="Enter your Equipment name"
                            className="rounded-2xl placeholder:text-slate-400"
                          />
                          <FieldError />
                        </TextField>
                      </div>

                      {/* Stock */}
                      <TextField
                        name="stock"
                        isRequired
                        defaultValue={String(stock)}
                        type="number"
                      >
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
                          defaultValue={category}
                          placeholder="Select category"
                          className="w-full rounded-2xl"
                        >
                          <Label className="p-3">Category</Label>
                          <Select.Trigger className="rounded-2xl">
                            <Select.Value className="text-black" />
                            <Select.Indicator />
                          </Select.Trigger>
                          <Select.Popover>
                            <ListBox>
                              <ListBox.Item
                                id="heavy equipment"
                                textValue="heavy equipment"
                              >
                                Heavy Equipment <ListBox.ItemIndicator />
                              </ListBox.Item>
                              <ListBox.Item
                                id="construction equipment"
                                textValue="construction equipment"
                              >
                                Construction Equipment <ListBox.ItemIndicator />
                              </ListBox.Item>
                              <ListBox.Item
                                id="power tools"
                                textValue="power tools"
                              >
                                Power Tools <ListBox.ItemIndicator />
                              </ListBox.Item>
                              <ListBox.Item
                                id="aerial equipment"
                                textValue="aerial equipment"
                              >
                                Aerial Equipment <ListBox.ItemIndicator />
                              </ListBox.Item>
                              <ListBox.Item
                                id="event equipment"
                                textValue="event equipment"
                              >
                                Event Equipment <ListBox.ItemIndicator />
                              </ListBox.Item>
                              <ListBox.Item
                                id="photography & video"
                                textValue="photography & video"
                              >
                                Photography & Video <ListBox.ItemIndicator />
                              </ListBox.Item>
                            </ListBox>
                          </Select.Popover>
                        </Select>
                      </div>

                      {/* Price */}
                      <TextField
                        name="price"
                        isRequired
                        defaultValue={String(price)}
                        type="number"
                      >
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
                          defaultValue={condition}
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
                              <ListBox.Item id="good" textValue="good">
                                Good <ListBox.ItemIndicator />
                              </ListBox.Item>
                              <ListBox.Item id="better" textValue="better">
                                Better <ListBox.ItemIndicator />
                              </ListBox.Item>
                              <ListBox.Item id="excellent" textValue="excellent">
                                Excellent <ListBox.ItemIndicator />
                              </ListBox.Item>
                            </ListBox>
                          </Select.Popover>
                        </Select>
                      </div>

                      {/* Rental Type */}
                      <div>
                        <Select
                          name="rentalType"
                          isRequired
                          defaultValue={rentalType}
                          className="rounded-2xl placeholder:text-black"
                          placeholder="Select rental type"
                        >
                          <Label>Rental Types</Label>
                          <Select.Trigger className="rounded-2xl flex">
                            <Select.Value className="text-black" />
                            <Select.Indicator />
                          </Select.Trigger>
                          <Select.Popover>
                            <ListBox>
                              <ListBox.Item id="daily" textValue="daily">
                                Per day <ListBox.ItemIndicator />
                              </ListBox.Item>
                              <ListBox.Item id="weekly" textValue="weekly">
                                Weekly <ListBox.ItemIndicator />
                              </ListBox.Item>
                              <ListBox.Item id="monthly" textValue="monthly">
                                Monthly <ListBox.ItemIndicator />
                              </ListBox.Item>
                            </ListBox>
                          </Select.Popover>
                        </Select>
                      </div>

                      {/* Description */}
                      <div className="md:col-span-2">
                        <TextField
                          name="description"
                          isRequired
                          defaultValue={description}
                        >
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
                          <TextField
                            name="image"
                            isRequired
                            isInvalid={isInvalid || imageError}
                          >
                            <Label>Image URL</Label>
                            <Input
                              id="equipment-image"
                              type="url"
                              placeholder="https://..."
                              value={imageUrl}
                              onChange={handleImageInputChange}
                              className="w-full bg-default-100"
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
                      isDisabled={saving}
                      className="rounded-2xl w-full bg-cyan-500 text-white font-bold"
                    >
                      {saving ? "Saving..." : "Save"}
                    </Button>
                  </form>
                </Surface>
              </Modal.Body>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
};

export default UpdateModal;