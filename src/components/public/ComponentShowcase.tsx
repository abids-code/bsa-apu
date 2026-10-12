import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export function ComponentShowcase() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-muted/40"
    >
      <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Say hello</CardTitle>
              <CardDescription>
                Questions about joining BSA or getting started at APU?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="user-name">Full name</Label>
                <Input id="user-name" placeholder="Your name" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="user-email">Email</Label>
                <Input id="user-email" type="email" placeholder="you@example.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="user-topic">Topic</Label>
                <Select defaultValue="join">
                  <SelectTrigger id="user-topic" className="w-full">
                    <SelectValue placeholder="Choose a topic" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="join">I want to join BSA</SelectItem>
                    <SelectItem value="arrival">Arrival support</SelectItem>
                    <SelectItem value="event">Event partnership</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="user-message">Message</Label>
                <Textarea id="user-message" placeholder="How can we help?" rows={4} />
              </div>

              <div className="flex items-center justify-between gap-3 rounded-md border bg-muted/30 p-3">
                <div className="flex items-center gap-2">
                  <Checkbox id="updates" defaultChecked />
                  <Label htmlFor="updates">Send updates</Label>
                </div>
                <Switch defaultChecked />
              </div>

              <Button className="w-full">Send message</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.section>
  );
}
