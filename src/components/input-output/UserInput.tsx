"use client";

import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Info, Loader2, Sparkles } from "lucide-react";
import { generateBio } from "@/app/actions";
import { BioContext } from "@/context/BioContext";

const formSchema = z.object({
  model: z.string().min(2, "Please select a Model"),
  temperature: z
    .number()
    .min(0, "Creativity level should be at least 0")
    .max(2, "Creativity level should be at most 2"),
  content: z
    .string()
    .min(50, "Describe yourself in at least 50 characters")
    .max(500, "Your description should not exceed 500 characters"),
  type: z.enum(["personal", "brand"], {
    errorMap: () => ({ message: "Please select a type" }),
  }),
  tone: z.enum(
    [
      "professional",
      "casual",
      "sarcastic",
      "funny",
      "passionate",
      "thoughtful",
    ],
    {
      errorMap: () => ({ message: "Please select the tone for your bio" }),
    }
  ),
  emojis: z.boolean(),
});

const UserInput = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      model: "llama3-8b-8192",
      temperature: 1,
      content: "",
      type: "personal",
      tone: "professional",
      emojis: false,
    },
  });

  const { setOutput, setLoading, loading } = useContext(BioContext);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    const userInputvalues = `
    User Input: ${values.content},
    Bio Type: ${values.type},
    Bio Tone: ${values.tone},
    Add Emojis: ${values.emojis},
    `;
    try {
      const { data } = await generateBio(
        userInputvalues,
        values.temperature,
        values.model
      );
      setOutput(data);
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-300 shadow-xl p-6 sm:p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Customize Your Bio
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <fieldset className="rounded-xl border border-blue-100 p-6 bg-blue-50 transition-all duration-300 hover:shadow-md">
            <legend className="text-lg font-semibold text-blue-600 px-2">
              AI Settings
            </legend>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">AI Model</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="border-gray-300 bg-white text-gray-800">
                          <SelectValue placeholder="Select an AI Model" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="llama3-8b-8192">
                          Llama 3 8B
                        </SelectItem>
                        <SelectItem value="mixtral-8x7b-32768">
                          Mixtral 8x7B
                        </SelectItem>
                        <SelectItem value="llama3-70b-8192">
                          Llama 3 70B
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="temperature"
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <FormLabel className="flex items-center justify-between text-gray-700">
                      <span className="flex items-center">
                        Creativity Level
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 cursor-pointer ml-1 text-blue-500" />
                          </TooltipTrigger>
                          <TooltipContent
                            sideOffset={5}
                            className="bg-white border-gray-200 text-gray-800 p-2 rounded-md shadow-lg"
                          >
                            <p className="max-w-xs">
                              A higher setting generates more imaginative and
                              unexpected bios, while a lower setting produces
                              more traditional and straightforward styles.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </span>
                      <span className="font-semibold text-blue-600">
                        {value}
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Slider
                        defaultValue={[1]}
                        max={2}
                        min={0}
                        step={0.1}
                        onValueChange={(val) => onChange(val[0])}
                        className="[&_[role=slider]]:bg-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </fieldset>

          <fieldset className="rounded-xl border border-gray-200 p-6 bg-gray-50 transition-all duration-300 hover:shadow-md">
            <legend className="text-lg font-semibold text-blue-600 px-2">
              Your Bio Details
            </legend>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">
                      About Yourself
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Describe yourself (Max 500 Characters)"
                        className="min-h-[10rem] border-gray-300 text-gray-800 placeholder-gray-400 resize-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Bio Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="border-gray-300 bg-white text-gray-800">
                            <SelectValue placeholder="Select Type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="personal">Personal</SelectItem>
                          <SelectItem value="brand">Brand</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Bio Tone</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="border-gray-300 bg-white text-gray-800">
                            <SelectValue placeholder="Select Tone" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="professional">
                            Professional
                          </SelectItem>
                          <SelectItem value="casual">Casual</SelectItem>
                          <SelectItem value="sarcastic">Sarcastic</SelectItem>
                          <SelectItem value="funny">Funny</SelectItem>
                          <SelectItem value="passionate">Passionate</SelectItem>
                          <SelectItem value="thoughtful">Thoughtful</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="emojis"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-200 p-4 bg-white">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base text-gray-700">
                        Include Emojis
                      </FormLabel>
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
            </div>
          </fieldset>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg py-3 text-lg font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <Sparkles className="w-5 h-5 mr-2" />
            )}
            {loading ? "Generating..." : "Generate Bio"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default UserInput;
