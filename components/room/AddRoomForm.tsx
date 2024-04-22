"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Hotel, Room } from "@prisma/client";
import axios from "axios";
import { Loader2, Pencil, XCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { UploadButton } from "../ui/uploadthing";
import { toast } from "../ui/use-toast";

interface AddRoomFormProps {
  hotel?: Hotel & {
    rooms: Room[];
  };
  room?: Room;
  handleDialogueOpen: () => void;
}

const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be atleast 3 chars long",
  }),
  description: z.string().min(3, {
    message: "Description must be atleast 3 chars long",
  }),
  bed_count: z.coerce.number().min(1, { message: "Bed count is required" }),
  guest_count: z.coerce.number().min(1, { message: "Guest count is required" }),
  bathroom_count: z.coerce
    .number()
    .min(1, { message: "Bathroom count is required" }),
  master_bed: z.coerce.number().min(0),
  king_bed: z.coerce.number().min(0),
  queen_bed: z.coerce.number().min(0),
  image: z.string().min(1, { message: "Image is required" }),
  room_price: z.coerce.number().min(1, {
    message: "Room price is required",
  }),
  breakfast_price: z.coerce.number().optional(),
  tv: z.boolean().optional(),
  air_condition: z.boolean().optional(),
  fridge: z.boolean().optional(),
  balcony: z.boolean().optional(),
  ocean_view: z.boolean().optional(),
  forest_view: z.boolean().optional(),
  mountain_view: z.boolean().optional(),
  free_wifi: z.boolean().optional(),
  sound_proof: z.boolean().optional(),
  room_service: z.boolean().optional(),
});

const AddRoomForm = ({ hotel, room, handleDialogueOpen }: AddRoomFormProps) => {
  const [image, setImage] = useState<string | undefined>(room?.image);
  const [shouldImageDelete, setShouldImageDelete] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: room || {
      title: "",
      description: "",
      bed_count: 0,
      guest_count: 0,
      bathroom_count: 0,
      master_bed: 0,
      queen_bed: 0,
      king_bed: 0,
      image: "",
      room_price: 0,
      breakfast_price: 0,
      tv: false,
      air_condition: false,
      fridge: false,
      balcony: false,
      ocean_view: false,
      forest_view: false,
      mountain_view: false,
      free_wifi: false,
      sound_proof: false,
      room_service: false,
    },
  });

  useEffect(() => {
    if (typeof image === "string") {
      form.setValue("image", image, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image]);

  const router = useRouter();

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    if (hotel && room) {
      axios
        .patch(`/api/room/${room.id}`, values)
        .then((res) => {
          toast({
            title: "Room updated!",
            description: "Your hotel room is successfully updated.",
          });
          router.refresh();
          setIsLoading(false);
          handleDialogueOpen();
        })
        .catch((err) => {
          console.log(err);
          toast({
            variant: "destructive",
            description: "Something went wrong.",
          });
          setIsLoading(false);
        });
    } else {
      if (!hotel) return;

      axios
        .post("/api/room", { ...values, hotelId: hotel.id })
        .then((res) => {
          toast({
            title: "Room created!",
            description: "Your hotel room is successfully created.",
          });
          router.refresh();
          setIsLoading(false);
          handleDialogueOpen();
        })
        .catch((err) => {
          console.log(err);
          toast({
            variant: "destructive",
            description: "Something went wrong.",
          });
          setIsLoading(false);
        });
    }
  }

  const handleImageDelete = (image: string) => {
    setShouldImageDelete(true);
    const imageKey = image.substring(image.lastIndexOf("/") + 1);

    axios
      .post("/api/uploadthing/delete", { imageKey })
      .then((res) => {
        if (res.data.success) {
          setImage("");
          toast({
            title: "Image deleted",
            description: "Your room image has been successfully deleted.",
          });
        }
      })
      .catch(() => {
        toast({
          variant: "destructive",
          title: "Image delete failed",
        });
      })
      .finally(() => {
        setShouldImageDelete(false);
      });
  };

  return (
    <div className="max-h-[75vh] overflow-y-auto p-2">
      <Form {...form}>
        <form className="space-y-5">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Room title</FormLabel>
                <FormDescription>Enter your room title</FormDescription>
                <FormControl>
                  <Input placeholder="Single room" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Room description</FormLabel>
                <FormDescription>Enter your room description</FormDescription>
                <FormControl>
                  <Textarea
                    placeholder="Have a beautiful view of the ocean"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <FormLabel>Choose room facilities</FormLabel>
            <FormDescription>
              What facilities make this room good?
            </FormDescription>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <FormField
                control={form.control}
                name="air_condition"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-end gap-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Air condition</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="balcony"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-end gap-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Balcony</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="forest_view"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-end gap-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Forest view</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="free_wifi"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-end gap-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Free wifi</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tv"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-end gap-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>TV</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fridge"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-end gap-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Fridge</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mountain_view"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-end gap-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Mountain view</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ocean_view"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-end gap-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Ocean view</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="room_service"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-end gap-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Room service</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sound_proof"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-end gap-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Sound proof</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Upload an image</FormLabel>
                <FormDescription>Upload a room image</FormDescription>
                <FormControl>
                  {image ? (
                    <div className="relative max-w-[400px] min-w-[400px] max-h-[400px] min-h-[400px] mt-4">
                      <Image
                        fill
                        src={image}
                        alt="Room image"
                        className="object-cover"
                      />
                      <Button
                        onClick={() => handleImageDelete(image)}
                        type="button"
                        size="icon"
                        className="absolute right-5 top-5"
                      >
                        {shouldImageDelete ? (
                          <Loader2 color="white" className="animate-spin" />
                        ) : (
                          <XCircle color="white" />
                        )}
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center max-w-[400px] p-12 border-2 border-dashed border-primary/50 rounded mt-4">
                      <UploadButton
                        endpoint="imageUploader"
                        onClientUploadComplete={(res) => {
                          console.log("Files: ", res);
                          setImage(res[0].url);
                          toast({
                            title: "Upload completed",
                            description:
                              "Your hotel image has been successfully uploaded.",
                          });
                        }}
                        onUploadError={(error: Error) => {
                          toast({
                            variant: "destructive",
                            title: "Image upload failed",
                            description: error.message,
                          });
                        }}
                      />
                    </div>
                  )}
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex gap-5">
            <div className="flex-1 flex flex-col gap-5">
              <FormField
                control={form.control}
                name="room_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room price</FormLabel>
                    <FormDescription>
                      Enter your room price is usd
                    </FormDescription>
                    <FormControl>
                      <Input type="number" min={0} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bed_count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bed count</FormLabel>
                    <FormDescription>
                      How many beds are available in this room?
                    </FormDescription>
                    <FormControl>
                      <Input type="number" min={0} max={5} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="guest_count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Guest count</FormLabel>
                    <FormDescription>
                      How many guests are allowed in this room?
                    </FormDescription>
                    <FormControl>
                      <Input type="number" min={0} max={10} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bathroom_count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bathroom count</FormLabel>
                    <FormDescription>
                      How many bathroom in this room?
                    </FormDescription>
                    <FormControl>
                      <Input type="number" min={0} max={5} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex-1 flex flex-col gap-5">
              <FormField
                control={form.control}
                name="breakfast_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Breakfast price</FormLabel>
                    <FormDescription>
                      Enter your breakfast price in usd
                    </FormDescription>
                    <FormControl>
                      <Input type="number" min={0} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="master_bed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Master bed</FormLabel>
                    <FormDescription>
                      How many master beds in this room?
                    </FormDescription>
                    <FormControl>
                      <Input type="number" min={0} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="king_bed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>King bed</FormLabel>
                    <FormDescription>
                      How many king beds in this room?
                    </FormDescription>
                    <FormControl>
                      <Input type="number" min={0} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="queen_bed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Queen bed</FormLabel>
                    <FormDescription>
                      How many queen beds in this room?
                    </FormDescription>
                    <FormControl>
                      <Input type="number" min={0} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="pt-4 pb-2">
            {room ? (
              <Button
                type="button"
                onClick={form.handleSubmit(onSubmit)}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Updating
                  </>
                ) : (
                  <>
                    <Pencil className="h-4 w-4" /> Update
                  </>
                )}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={form.handleSubmit(onSubmit)}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Creating
                  </>
                ) : (
                  <>
                    <Pencil className="h-4 w-4" /> Create
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddRoomForm;
