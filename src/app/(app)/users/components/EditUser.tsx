"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User } from "@/types/user";
import { useUserContext } from "@/contexts/userContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Updated schema with role
const lawyerFormSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters." }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  role: z.string().min(2, { message: "Role must be selected." }),
});

const EditUser = ({
  userData,
  isOpen,
  onClose,
}: {
  userData: User;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { updateUser, isSubmiting } = useUserContext();

  const form = useForm<z.infer<typeof lawyerFormSchema>>({
    resolver: zodResolver(lawyerFormSchema),
    defaultValues: {
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role || "", // Add role default
    },
  });

  const onSubmit = async (data: z.infer<typeof lawyerFormSchema>) => {
    const newdata: any = {
      id: userData.id,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role,
    };
    try {
      await updateUser(newdata);
      onClose();
      form.reset();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent
          side="right"
          className="w-[400px] sm:w-[50%]"
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <SheetHeader>
            <SheetTitle>Update user</SheetTitle>
            <SheetDescription>
              Update user details in the system.
            </SheetDescription>
          </SheetHeader>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <ScrollArea className="h-[calc(100vh-180px)] px-4 ">
              <div className="space-y-2 mb-4">
                <Label htmlFor="firstName">First name</Label>
                <Input id="firstName" {...form.register("firstName")} />
                {form.formState.errors.firstName && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.firstName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2 mb-4">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" {...form.register("lastName")} />
                {form.formState.errors.lastName && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.lastName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2 mb-4">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...form.register("email")} />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              {/* Role selection using Controller */}
              <div className="space-y-2 mb-4">
                <Label htmlFor="role">Role</Label>
                <Controller
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="academic">Academic</SelectItem>
                        <SelectItem value="student">Student Manager</SelectItem>
                        <SelectItem value="hr">HR Manager</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {form.formState.errors.role && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.role.message}
                  </p>
                )}
              </div>
            </ScrollArea>
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmiting}>
                {isSubmiting ? "Updating..." : "Update user"}
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default EditUser;
