import {
  Bell,
  CalendarDays,
  Check,
  ChevronRight,
  CircleHelp,
  Compass,
  HeartHandshake,
  Mail,
  Sparkles,
  Users,
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const initiatives = [
  {
    title: "Arrival support",
    description: "Airport pickup, housing help, and a local guide for life in Beppu.",
    value: 92,
  },
  {
    title: "Community nights",
    description: "Monthly gatherings, Eid dinners, and cultural meetups across campus.",
    value: 84,
  },
  {
    title: "Member wellbeing",
    description: "Halal food suggestions, peer mentoring, and an easy first-year forum.",
    value: 88,
  },
];

const quickWins = [
  "Welcome pack for new students",
  "Culture nights and food weekends",
  "Mentorship from senior members",
  "Volunteer sign-up for campus events",
  "Community updates and WhatsApp sharing",
];

const timeline = [
  { month: "August", item: "Freshers welcome and orientation support" },
  { month: "September", item: "Eid and community meal gatherings" },
  { month: "October", item: "Culture meetup with Bangla music and food" },
  { month: "December", item: "Victory Day programming and cultural stage show" },
];

export function MemberSupportSection() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <Badge className="bg-primary/10 text-primary hover:bg-primary/15">
            <Users className="mr-2 h-3.5 w-3.5" />
            Member toolkit
          </Badge>
          <h2 className="mt-4 text-5xl md:text-6xl">Support built around community</h2>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-fit">
              Quick links
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Resources</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Welcome guide</DropdownMenuItem>
            <DropdownMenuItem>Event calendar</DropdownMenuItem>
            <DropdownMenuItem>Mentor network</DropdownMenuItem>
            <DropdownMenuItem>Volunteer desk</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle>What new members receive</CardTitle>
                <CardDescription className="mt-1">
                  A simple overview of how BSA makes APU feel like home.
                </CardDescription>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="Info about member support">
                      <CircleHelp className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Updated each semester for incoming students.</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="welcome" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="welcome">Welcome</TabsTrigger>
                <TabsTrigger value="culture">Culture</TabsTrigger>
                <TabsTrigger value="support">Support</TabsTrigger>
              </TabsList>
              <TabsContent value="welcome" className="space-y-4 pt-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-primary/40">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      B
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">Welcome desk</p>
                    <p className="text-sm text-muted-foreground">
                      Peer answers for your first month at APU.
                    </p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" /> Airport pickup coordination
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" /> Housing recommendations and roommates
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" /> Everyday guidance for local life in
                    Beppu
                  </li>
                </ul>
              </TabsContent>
              <TabsContent value="culture" className="pt-4">
                <p className="text-sm text-muted-foreground">
                  From Eid celebrations to cultural nights, BSA keeps Bangladeshi traditions alive
                  through food, music, language, and storytelling.
                </p>
              </TabsContent>
              <TabsContent value="support" className="pt-4">
                <p className="text-sm text-muted-foreground">
                  Students can ask for academic, financial, or personal support through our active
                  volunteer and peer network.
                </p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Operational snapshot</CardTitle>
            <CardDescription>How active our support efforts are this semester.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <Alert>
              <Bell className="h-4 w-4" />
              <AlertTitle>Semester update</AlertTitle>
              <AlertDescription>
                New student onboarding is open. Applications for mentor matching close Friday.
              </AlertDescription>
            </Alert>

            {initiatives.map((item) => (
              <div key={item.title} className="space-y-2">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium">{item.title}</span>
                  <span className="text-muted-foreground">{item.value}%</span>
                </div>
                <Progress value={item.value} />
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {[
          {
            icon: Sparkles,
            title: "Cultural connection",
            text: "Celebrate Bangla traditions, food, and community with APU students and families.",
          },
          {
            icon: HeartHandshake,
            title: "Practical help",
            text: "From arrival support to orientation, we help students feel settled from day one.",
          },
          {
            icon: Compass,
            title: "Connections",
            text: "Build a network with seniors, alumni, and students from across Bangladesh and APU.",
          },
        ].map(({ icon: Icon, title, text }) => (
          <Card key={title} className="h-full">
            <CardContent className="flex h-full flex-col p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-2xl">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{text}</p>
              <Button variant="link" className="mt-auto w-fit px-0 text-primary">
                Learn more
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader>
            <CardTitle>Common questions</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Who can join the association?</AccordionTrigger>
                <AccordionContent>
                  Any student interested in Bangladeshi culture, friendship, and community support
                  is welcome to participate.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Do you help new arrivals?</AccordionTrigger>
                <AccordionContent>
                  Yes. We support students with settling-in tips, roommate connections, and
                  practical life guidance in Beppu.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Can international students join events?</AccordionTrigger>
                <AccordionContent>
                  Absolutely. Most BSA events are open to the wider APU community and anyone who
                  wants to learn about Bangladesh.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-2">
              <CardTitle>Volunteer tracker</CardTitle>
              <Badge variant="secondary">Live</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-md border p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">Volunteer inbox</p>
                  <p className="text-xs text-muted-foreground">12 new replies this week</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                View
              </Button>
            </div>

            <Separator />

            <ScrollArea className="h-44 rounded-md border p-3">
              <div className="space-y-3 text-sm">
                {quickWins.map((item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between gap-3 rounded-md bg-muted/40 p-2"
                  >
                    <span>{item}</span>
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming programme</CardTitle>
            <CardDescription>Key dates and planning checkpoints for members.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead>Event plan</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {timeline.map((row) => (
                  <TableRow key={row.month}>
                    <TableCell>{row.month}</TableCell>
                    <TableCell>{row.item}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="gap-1">
                        <CalendarDays className="h-3 w-3" /> Planned
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 flex justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              Volunteer for BSA
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Join the volunteer desk</DialogTitle>
              <DialogDescription>
                Share your area of interest and we’ll connect you to the right team.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="interest">Area of interest</Label>
                <Input id="interest" defaultValue="Event management" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="availability">Availability</Label>
                <Select defaultValue="weekends">
                  <SelectTrigger id="availability">
                    <SelectValue placeholder="Select availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekends">Weekends</SelectItem>
                    <SelectItem value="weekday-evenings">Weekday evenings</SelectItem>
                    <SelectItem value="flexible">Flexible</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" placeholder="Tell us what you’d like to help with..." />
              </div>
              <div className="flex items-center justify-between rounded-md border p-3">
                <div className="space-y-0.5">
                  <Label htmlFor="updates">Send updates</Label>
                  <p className="text-xs text-muted-foreground">Get BSA event reminders</p>
                </div>
                <Switch id="updates" defaultChecked />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="consent" defaultChecked />
                <Label htmlFor="consent">I’m happy to receive volunteer follow-ups.</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save my interest</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
