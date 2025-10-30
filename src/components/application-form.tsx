"use client";

import * as React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle2,
  Loader2,
  ShoppingCart,
} from "lucide-react";

import { merchOrderSchema, type MerchOrderData } from "@/app/schema";
import { submitApplication } from "@/app/actions";
import { DEPARTMENTS, TSHIRT_DESIGNS, BASE_PRICE, SERVICE_CHARGE, TSHIRT_SIZES } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Switch } from "./ui/switch";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { useRouter } from "next/navigation";

export function ApplicationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const formatCurrency = (value: number) => `Rs.${value}`;

  const form = useForm<MerchOrderData>({
    resolver: zodResolver(merchOrderSchema),
    defaultValues: {
      isMember: false,
      name: "",
      regNo: "",
      email: "",
      phone: "",
      department: "" as any,
      tshirtDesign: "" as any,
      size: "" as any,
    },
    mode: "onTouched",
  });

  const isMember = form.watch("isMember");
  const selectedDesign = form.watch("tshirtDesign");

  React.useEffect(() => {
    if (isMember) {
      // Auto-select member-exclusive for members
      form.setValue("tshirtDesign", "member-exclusive", { shouldValidate: true, shouldDirty: true });
    } else if (selectedDesign === "member-exclusive") {
      // Clear member-exclusive when switching to non-member to force a valid selection
      form.setValue("tshirtDesign", "" as any, { shouldValidate: true, shouldDirty: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMember]);

  const availableDesigns = TSHIRT_DESIGNS.filter(d => !d.membersOnly);

  const totalPrice = BASE_PRICE + SERVICE_CHARGE;

  const processForm = async (data: MerchOrderData) => {
    setIsSubmitting(true);
    
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    const result = await submitApplication(formData);

    if (result.success) {
      // Navigate to success page
      form.reset();
      router.push('/order/success');
    } else {
      toast({
        title: "Order Failed",
        description: result.error || "An error occurred. Please try again.",
        variant: "destructive",
      });
    }
    setIsSubmitting(false);
  };

  const handlePlaceAnotherOrder = () => {
    setOrderComplete(false);
    form.reset();
  };

  return (
    <Form {...form}>
      {/* Success acknowledgement moved to /order/success page */}
      <form onSubmit={form.handleSubmit(processForm)} className="space-y-6">
        <FormField
          control={form.control}
          name="isMember"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Are you a Thanima member?
                </FormLabel>
                <FormDescription>
                  Members get access to exclusive designs
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {!isMember && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Select Your T-shirt Design</h3>
            <FormField
              control={form.control}
              name="tshirtDesign"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
                    >
                      {availableDesigns.map((design) => (
                        <div key={design.value}>
                          <RadioGroupItem
                            value={design.value}
                            id={design.value}
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor={design.value}
                            className={cn(
                              "flex flex-col cursor-pointer rounded-lg border-2 border-muted bg-popover p-0 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary overflow-hidden",
                              selectedDesign === design.value && "ring-2 ring-primary"
                            )}
                          >
                            <div className="relative aspect-square">
                              <Image
                                src={design.imageUrl}
                                alt={design.name}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                className="object-cover"
                              />
                            </div>
                            <div className="p-3 space-y-1">
                              <p className="text-sm font-medium leading-none">
                                {design.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {design.description}
                              </p>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Your Details</h3>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="regNo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Registration Number</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 24BYB1234" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>WhatsApp Number</FormLabel>
                <FormControl>
                  <Input placeholder="Your phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your department" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {DEPARTMENTS.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>T-shirt Size</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your size" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {TSHIRT_SIZES.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Base Price</span>
              <span className="font-medium">{formatCurrency(BASE_PRICE)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Service Charge</span>
              <span className="font-medium">{formatCurrency(SERVICE_CHARGE)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span className="font-semibold">Total</span>
              <span className="font-bold text-lg">{formatCurrency(totalPrice)}</span>
            </div>
          </CardContent>
        </Card>

        <Button
          type="submit"
          className="w-full button-glow interactive-element pulse-animation glow-effect"
          size="lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Place Order
            </>
          )}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          You will receive payment instructions after placing your order.
        </p>
      </form>
    </Form>
  );
}
