"use client";

import React, { useContext, useState } from "react";
import { BioContext } from "@/context/BioContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Copy, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function UserOutput() {
  const { output, loading } = useContext(BioContext);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const { toast } = useToast();

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
      toast({
        title: "Copied!",
        description: "Bio has been copied to clipboard.",
        duration: 2000,
      });
    } catch (err) {
      console.error("Failed to copy text: ", err);
      toast({
        title: "Error",
        description: "Failed to copy bio. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  return (
    <Card className="w-full shadow-xl">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600">
        <CardTitle className="text-2xl font-bold text-white flex items-center">
          <Sparkles className="w-6 h-6 mr-2" />
          Generated Bios
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="w-full h-24" />
            <Skeleton className="w-3/4 h-24" />
            <Skeleton className="w-1/2 h-24" />
          </div>
        ) : (
          <div className="space-y-4">
            {output?.data.map((data, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <p className="text-sm text-gray-800 flex-grow pr-4">
                        {data.bio}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-shrink-0 ml-2"
                        onClick={() => copyToClipboard(data.bio, index)}
                      >
                        {copiedIndex === index ? (
                          <motion.span
                            initial={{ scale: 0.5 }}
                            animate={{ scale: 1 }}
                            className="flex items-center"
                          >
                            Copied!
                          </motion.span>
                        ) : (
                          <motion.span
                            initial={{ scale: 0.5 }}
                            animate={{ scale: 1 }}
                            className="flex items-center"
                          >
                            <Copy className="w-4 h-4 mr-1" />
                            Copy
                          </motion.span>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
