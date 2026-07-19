"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Playfair_Display, Lato } from "next/font/google";
import {
  ArrowUpRight,
  Check,
  ExternalLink,
  Flower2,
  Gift,
  Heart,
  Leaf,
  MapPin,
  Send,
  Sprout,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createRsvpAction } from "@/app/actions/rsvp";
import { toast } from "sonner";

// Load Google Fonts locally to optimize loading speeds
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-playfair",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
  variable: "--font-lato",
});

interface EventData {
  id: string;
  userId: string;
  title: string;
  slug: string;
  type: string;
  date: Date;
  venue: string;
  coverImage: string | null;
  theme: string | null;
  description: string | null;
  relationshipTree: string | null;
}

interface GuestData {
  id: string;
  eventId: string;
  name: string;
  phone: string | null;
  relation: string | null;
  attendance: string | null;
  guestCount: string | null;
  side: string | null;
}

interface Wedding01Props {
  event: EventData;
  initialGuests: GuestData[];
}

export default function Wedding01({ event, initialGuests }: Wedding01Props) {
  // Helper to extract first names from event title (e.g. "Emma & James's Wedding" -> ["Emma", "James"])
  const getNames = () => {
    const title = event.title || "Emma & James";
    // Remove common wedding suffixes
    const cleanTitle = title
      .replace(/'s\s+Wedding/gi, "")
      .replace(/\s+Wedding/gi, "")
      .replace(/\s+Celebration/gi, "");
    
    // Split by & or and
    const parts = cleanTitle.split(/\s+&\s+|\s+and\s+/i);
    if (parts.length >= 2) {
      return [parts[0].trim(), parts[1].trim()];
    }
    return [cleanTitle, ""];
  };

  const [name1, name2] = getNames();
  const initials = name2 ? `${name1.charAt(0)} & ${name2.charAt(0)}` : name1.slice(0, 3).toUpperCase();

  // Dynamic client-side countdown state
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date(event.date).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [event.date]);

  // RSVP Form States
  const [rsvpName, setRsvpName] = useState("");
  const [rsvpPhone, setRsvpPhone] = useState("");
  const [rsvpChoice, setRsvpChoice] = useState<"yes" | "no" | null>(null);
  const [isSubmittingRsvp, setIsSubmittingRsvp] = useState(false);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rsvpName.trim()) {
      toast.error("Please enter your full name");
      return;
    }
    if (!rsvpPhone.trim()) {
      toast.error("Please enter your phone number");
      return;
    }
    if (!rsvpChoice) {
      toast.error("Please select whether you will attend");
      return;
    }

    setIsSubmittingRsvp(true);

    try {
      const response = await createRsvpAction({
        eventId: event.id,
        name: rsvpName,
        phone: rsvpPhone,
        relation: "friend",
        attendance: rsvpChoice,
        guestCount: "1",
        side: "mutual",
      });

      if (response.success) {
        setRsvpSubmitted(true);
        toast.success(
          rsvpChoice === "yes"
            ? `Hooray! Thank you, ${rsvpName}. RSVP confirmed!`
            : `Thank you, ${rsvpName}. Response saved.`
        );
      } else {
        toast.error(response.error || "Failed to submit RSVP");
      }
    } catch (err) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSubmittingRsvp(false);
    }
  };

  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className={`${lato.variable} ${playfair.variable} font-sans`}>
      <div className="bg-white text-neutral-950 w-full min-h-screen max-w-full overflow-x-hidden">
        {/* Navigation Bar */}
        <nav className="sticky top-0 z-50 backdrop-blur-sm border-b border-black/10 bg-white/90 flex px-6 md:px-12 py-4 justify-between items-center">
          <div className={`${playfair.className} text-[oklch(0.55_0.05_25)] text-xl leading-7 tracking-[4.8px]`}>
            {initials}
          </div>
          <div className="uppercase text-neutral-500 text-[10px] md:text-xs leading-4 tracking-[3.2px] flex items-center gap-4 md:gap-8">
            <a className="text-[oklch(0.55_0.05_25)] border-b border-[oklch(0.75_0.09_85)] pb-1 cursor-pointer">
              Home
            </a>
            <a className="transition-colors hover:text-neutral-800 cursor-pointer">Our Story</a>
            <a className="transition-colors hover:text-neutral-800 cursor-pointer">Gallery</a>
            <a className="transition-colors hover:text-neutral-800 cursor-pointer">Details</a>
            <a className="transition-colors hover:text-neutral-800 cursor-pointer">RSVP</a>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative bg-[oklch(0.98_0.01_90)] flex justify-center items-center w-full h-[620px] overflow-hidden px-4">
          <Image
            alt="The couple"
            className="object-cover opacity-40"
            src="https://images.unsplash.com/photo-1519741497674-611481863552?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxyb21hbnRpYyUyMGNvdXBsZSUyMHdlZGRpbmclMjBlbWJyYWNlJTIwc29mdCUyMGxpZ2h0fGVufDF8MHx8fDE3ODM0MTgzNzh8MA&ixlib=rb-4.1.0&q=80&w=1600"
            fill
            sizes="100vw"
            priority
          />
          <div className="bg-[linear-gradient(180deg,oklch(0.99_0.01_90/0.55),oklch(0.96_0.02_20/0.35),oklch(0.99_0.01_90/0.55))] absolute inset-0" />
          <div className="relative z-10 border border-[oklch(0.72_0.1_85)] backdrop-blur-[2px] text-center rounded-sm bg-white/30 p-8 md:p-12 flex mx-auto flex-col items-center w-full max-w-[720px]">
            <span className="text-[oklch(0.55_0.05_25)] uppercase text-[10px] md:text-xs leading-4 tracking-[6px] md:tracking-[8px] mb-4">
              Together with their families
            </span>
            <h1 className={`${playfair.className} text-[oklch(0.28_0.02_25)] leading-none`}>
              <span className="block italic text-6xl md:text-7xl leading-tight md:leading-18">{name1}</span>
              {name2 && (
                <>
                  <span className="block text-[oklch(0.6_0.06_140)] text-2xl md:text-3xl leading-9 my-2">&amp;</span>
                  <span className="block italic text-6xl md:text-7xl leading-tight md:leading-18">{name2}</span>
                </>
              )}
            </h1>
            <div className="text-[oklch(0.45_0.03_25)] uppercase text-xs md:text-sm leading-5 tracking-[3px] md:tracking-[4.8px] flex mt-6 items-center gap-3 md:gap-4">
              <span className="bg-[oklch(0.72_0.1_85)] w-6 md:w-10 h-px" />
              <span>{formattedDate}</span>
              <span className="bg-[oklch(0.72_0.1_85)] w-6 md:w-10 h-px" />
            </div>
            <p className="uppercase text-neutral-500 text-[10px] md:text-xs leading-4 tracking-[3px] md:tracking-[4px] mt-2">
              {event.venue}
            </p>
          </div>
        </section>

        {/* Countdown Section */}
        <section className="bg-[oklch(0.97_0.02_20)] flex p-8 md:p-12 flex-col items-center w-full">
          <Sprout className="size-6 text-[oklch(0.6_0.06_140)] mb-2" />
          <p className={`${playfair.className} text-[oklch(0.45_0.03_25)] italic text-xl md:text-2xl leading-8 mb-8 text-center`}>
            Counting down to forever
          </p>
          <div className="flex items-center gap-4 md:gap-8">
            <div className="flex flex-col items-center">
              <span className={`${playfair.className} text-[oklch(0.6_0.09_85)] font-light text-4xl md:text-6xl leading-tight`}>
                {String(timeLeft.days).padStart(2, "0")}
              </span>
              <span className="uppercase text-neutral-500 text-[10px] md:text-xs leading-4 tracking-[3px] md:tracking-[4.8px] mt-2">
                Days
              </span>
            </div>
            <span className={`${playfair.className} text-[oklch(0.75_0.08_85)] text-2xl md:text-4xl leading-10`}>
              :
            </span>
            <div className="flex flex-col items-center">
              <span className={`${playfair.className} text-[oklch(0.6_0.09_85)] font-light text-4xl md:text-6xl leading-tight`}>
                {String(timeLeft.hours).padStart(2, "0")}
              </span>
              <span className="uppercase text-neutral-500 text-[10px] md:text-xs leading-4 tracking-[3px] md:tracking-[4.8px] mt-2">
                Hours
              </span>
            </div>
            <span className={`${playfair.className} text-[oklch(0.75_0.08_85)] text-2xl md:text-4xl leading-10`}>
              :
            </span>
            <div className="flex flex-col items-center">
              <span className={`${playfair.className} text-[oklch(0.6_0.09_85)] font-light text-4xl md:text-6xl leading-tight`}>
                {String(timeLeft.minutes).padStart(2, "0")}
              </span>
              <span className="uppercase text-neutral-500 text-[10px] md:text-xs leading-4 tracking-[3px] md:tracking-[4.8px] mt-2">
                Minutes
              </span>
            </div>
            <span className={`${playfair.className} text-[oklch(0.75_0.08_85)] text-2xl md:text-4xl leading-10`}>
              :
            </span>
            <div className="flex flex-col items-center">
              <span className={`${playfair.className} text-[oklch(0.6_0.09_85)] font-light text-4xl md:text-6xl leading-tight`}>
                {String(timeLeft.seconds).padStart(2, "0")}
              </span>
              <span className="uppercase text-neutral-500 text-[10px] md:text-xs leading-4 tracking-[3px] md:tracking-[4.8px] mt-2">
                Seconds
              </span>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="bg-white flex p-8 md:p-12 flex-col items-center w-full px-4">
          <div className="flex mb-2 items-center gap-4">
            <Leaf className="size-4 text-[oklch(0.6_0.06_140)] -scale-x-100" />
            <span className="text-[oklch(0.55_0.05_25)] uppercase text-[10px] md:text-xs leading-4 tracking-[4.8px] md:tracking-[6.4px]">
              Our Story
            </span>
            <Leaf className="size-4 text-[oklch(0.6_0.06_140)]" />
          </div>
          <h2 className={`${playfair.className} text-[oklch(0.28_0.02_25)] italic text-3xl md:text-4xl leading-10 mb-8 text-center`}>
            How it all began
          </h2>
          <div className="relative flex flex-col gap-8 w-full max-w-[720px]">
            <div className="left-1/2 bg-[oklch(0.8_0.06_85)] -translate-x-1/2 absolute inset-y-0 w-px" />
            
            {/* Story Event 1 */}
            <div className="relative flex items-center gap-6">
              <div className="w-1/2 text-right pr-6 md:pr-8">
                <h3 className={`${playfair.className} text-[oklch(0.35_0.02_25)] text-lg md:text-xl leading-7`}>
                  First Meeting
                </h3>
                <p className="leading-relaxed text-neutral-500 text-xs md:text-sm leading-5 mt-1">
                  A rainy afternoon at a little café in Portland where two strangers shared one umbrella.
                </p>
              </div>
              <span className="left-1/2 -translate-x-1/2 size-3 bg-[oklch(0.7_0.1_85)] ring-4 ring-white rounded-full absolute" />
              <div className="w-1/2 text-[oklch(0.6_0.06_140)] uppercase text-[10px] md:text-xs leading-4 tracking-[2px] md:tracking-[3.2px] pl-6 md:pl-8">
                Spring 2019
              </div>
            </div>

            {/* Story Event 2 */}
            <div className="relative flex items-center gap-6">
              <div className="w-1/2 text-[oklch(0.6_0.06_140)] text-right uppercase text-[10px] md:text-xs leading-4 tracking-[2px] md:tracking-[3.2px] pr-6 md:pr-8">
                Winter 2021
              </div>
              <span className="left-1/2 -translate-x-1/2 size-3 bg-[oklch(0.7_0.1_85)] ring-4 ring-white rounded-full absolute" />
              <div className="w-1/2 pl-6 md:pl-8">
                <h3 className={`${playfair.className} text-[oklch(0.35_0.02_25)] text-lg md:text-xl leading-7`}>
                  The Adventure
                </h3>
                <p className="leading-relaxed text-neutral-500 text-xs md:text-sm leading-5 mt-1">
                  We traveled the coast together, discovering that home is wherever we are side by side.
                </p>
              </div>
            </div>

            {/* Story Event 3 */}
            <div className="relative flex items-center gap-6">
              <div className="w-1/2 text-right pr-6 md:pr-8">
                <h3 className={`${playfair.className} text-[oklch(0.35_0.02_25)] text-lg md:text-xl leading-7`}>
                  The Proposal
                </h3>
                <p className="leading-relaxed text-neutral-500 text-xs md:text-sm leading-5 mt-1">
                  Under a canopy of golden lights, one question changed everything — and she said yes.
                </p>
              </div>
              <span className="left-1/2 -translate-x-1/2 size-3 bg-[oklch(0.7_0.1_85)] ring-4 ring-white rounded-full absolute" />
              <div className="w-1/2 text-[oklch(0.6_0.06_140)] uppercase text-[10px] md:text-xs leading-4 tracking-[2px] md:tracking-[3.2px] pl-6 md:pl-8">
                Autumn 2025
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="bg-[oklch(0.98_0.01_90)] flex p-8 md:p-12 flex-col items-center w-full px-4">
          <div className="flex mb-2 items-center gap-4">
            <Flower2 className="size-4 text-[oklch(0.6_0.06_140)]" />
            <span className="text-[oklch(0.55_0.05_25)] uppercase text-[10px] md:text-xs leading-4 tracking-[4.8px] md:tracking-[6.4px]">
              Moments
            </span>
          </div>
          <h2 className={`${playfair.className} text-[oklch(0.28_0.02_25)] italic text-3xl md:text-4xl leading-10 mb-8 text-center`}>
            Our Gallery
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 max-w-[960px] gap-4 w-full">
            <div className="col-span-2 row-span-2 aspect-square border border-[oklch(0.8_0.06_85)] rounded-lg overflow-hidden relative">
              <Image
                alt="Couple outdoor"
                className="object-cover"
                src="https://images.unsplash.com/photo-1735838567596-915e21f721e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxicmlkZSUyMGdyb29tJTIwY2FuZGlkJTIwb3V0ZG9vcnxlbnwxfDJ8fHwxNzgzNDE4Mzc3fDA&ixlib=rb-4.1.0&q=80&w=800"
                fill
                sizes="(max-width: 768px) 100vw, 480px"
              />
            </div>
            <div className="col-span-1 aspect-square border border-[oklch(0.8_0.06_85)] rounded-lg overflow-hidden relative">
              <Image
                alt="Couple laughing"
                className="object-cover"
                src="https://images.unsplash.com/photo-1746192703344-4468f7475c50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxjb3VwbGUlMjBsYXVnaGluZyUyMHdlZGRpbmclMjBwb3J0cmFpdHxlbnwxfDJ8fHwxNzgzNDE4Mzc4fDA&ixlib=rb-4.1.0&q=80&w=400"
                fill
                sizes="(max-width: 768px) 50vw, 240px"
              />
            </div>
            <div className="col-span-1 aspect-square border border-[oklch(0.8_0.06_85)] rounded-lg overflow-hidden relative">
              <Image
                alt="Rings"
                className="object-cover"
                src="https://images.unsplash.com/photo-1616598942275-54b2c4a7f6b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwcmluZ3MlMjBoYW5kcyUyMGNsb3NlJTIwdXB8ZW58MXwyfHx8MTg4MzQxODM3OHww&ixlib=rb-4.1.0&q=80&w=400"
                fill
                sizes="(max-width: 768px) 50vw, 240px"
              />
            </div>
            <div className="col-span-2 aspect-[2/1] border border-[oklch(0.8_0.06_85)] rounded-lg overflow-hidden relative">
              <Image
                alt="Holding hands"
                className="object-cover"
                src="https://images.unsplash.com/photo-1541679368093-5c967ac6de11?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxlbmdhZ2VtZW50JTIwY291cGxlJTIwaG9sZGluZyUyMGhhbmRzJTIwZWxlZ2FudHxlbnwxfDF8fHwxNzgzNDE4Mzc4fDA&ixlib=rb-4.1.0&q=80&w=800"
                fill
                sizes="(max-width: 768px) 100vw, 480px"
              />
            </div>
          </div>
        </section>

        {/* Venue & RSVP Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 bg-white p-8 md:p-12 items-stretch gap-8 md:gap-12 w-full px-4">
          <div className="flex flex-col">
            <div className="flex mb-4 items-center gap-3">
              <MapPin className="size-4 text-[oklch(0.7_0.1_85)]" />
              <span className="text-[oklch(0.55_0.05_25)] uppercase text-[10px] md:text-xs leading-4 tracking-[4.8px] md:tracking-[6.4px]">
                The Venue
              </span>
            </div>
            <h2 className={`${playfair.className} text-[oklch(0.28_0.02_25)] italic text-2xl md:text-3xl leading-9 mb-4`}>
              {event.venue.split("·")[0].trim()}
            </h2>
            <div className="relative border border-[oklch(0.8_0.06_85)] min-h-[280px] rounded-lg flex-1 overflow-hidden">
              <Image
                alt="map"
                className="object-cover"
                src="https://screens-image-components-public.s3.eu-north-1.amazonaws.com/city-navigation-map.png"
                fill
                sizes="(max-width: 768px) 100vw, 480px"
              />
              <div className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-full flex absolute flex-col items-center">
                <MapPin className="size-8 text-[oklch(0.65_0.12_85)] drop-shadow-[0_2px_4px_oklch(0.3_0.05_25/0.4)] fill-[oklch(0.85_0.12_85)]" />
              </div>
              <div className="backdrop-blur-sm rounded-sm bg-white/80 absolute inset-x-4 bottom-4 p-4 shadow-sm">
                <p className="text-neutral-950 text-xs md:text-sm leading-5">
                  {event.venue}
                </p>
                <a className="text-[oklch(0.6_0.09_85)] inline-flex uppercase text-[10px] leading-4 tracking-[2px] md:tracking-[3.2px] mt-1 items-center gap-1 cursor-pointer hover:text-[oklch(0.5_0.08_75)]">
                  Get Directions
                  <ArrowUpRight className="size-3" />
                </a>
              </div>
            </div>
          </div>

          <Card className="border-[oklch(0.8_0.06_85)] bg-[oklch(0.98_0.02_20)] rounded-lg p-6 md:p-8 flex flex-col justify-between">
            {rsvpSubmitted ? (
              <div className="text-center py-16 flex flex-col items-center justify-center gap-4">
                <div className="size-16 bg-emerald-500/10 rounded-full flex items-center justify-center">
                  <Check className="size-8 text-emerald-500" />
                </div>
                <h3 className={`${playfair.className} text-[oklch(0.28_0.02_25)] text-xl font-bold`}>
                  Thank you!
                </h3>
                <p className="text-sm text-neutral-500">
                  Your response has been successfully submitted and saved.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRsvpSubmit} className="flex flex-col gap-6 h-full">
                <CardHeader className="text-center p-0 items-center gap-2">
                  <span className={`${playfair.className} text-[oklch(0.55_0.05_25)] italic text-xl md:text-2xl leading-8`}>
                    Kindly Répondez
                  </span>
                  <CardTitle className={`${playfair.className} text-[oklch(0.28_0.02_25)] font-normal text-2xl md:text-3xl leading-9`}>
                    RSVP
                  </CardTitle>
                  <CardDescription className="uppercase text-[10px] md:text-xs leading-4 tracking-[3.2px]">
                    Please respond as soon as possible
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex p-0 flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label className={`${playfair.className} text-[oklch(0.45_0.03_25)] italic text-base leading-6`}>
                      Your name
                    </label>
                    <Input
                      className="border-[oklch(0.82_0.05_85)] rounded-sm bg-white"
                      placeholder="Emma &amp; James Doe"
                      value={rsvpName}
                      onChange={(e) => setRsvpName(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className={`${playfair.className} text-[oklch(0.45_0.03_25)] italic text-base leading-6`}>
                      Phone number
                    </label>
                    <Input
                      className="border-[oklch(0.82_0.05_85)] rounded-sm bg-white"
                      placeholder="e.g. +1 555 123 4567"
                      value={rsvpPhone}
                      onChange={(e) => setRsvpPhone(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className={`${playfair.className} text-[oklch(0.45_0.03_25)] italic text-base leading-6`}>
                      Will you attend?
                    </label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        onClick={() => setRsvpChoice("yes")}
                        className={`border rounded-sm flex-1 ${
                          rsvpChoice === "yes"
                            ? "bg-[oklch(0.5_0.05_25)] text-white border-transparent hover:bg-[oklch(0.45_0.05_25)]"
                            : "border-[oklch(0.7_0.1_85)] text-[oklch(0.5_0.05_25)] hover:bg-black/5"
                        }`}
                        variant={rsvpChoice === "yes" ? "default" : "outline"}
                      >
                        <Check className="size-4" />
                        Joyfully accepts
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setRsvpChoice("no")}
                        className={`border rounded-sm flex-1 ${
                          rsvpChoice === "no"
                            ? "bg-red-600 text-white border-transparent hover:bg-red-700"
                            : "border-[oklch(0.82_0.05_85)] text-neutral-500 hover:bg-black/5"
                        }`}
                        variant={rsvpChoice === "no" ? "default" : "outline"}
                      >
                        Regretfully declines
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-0 mt-auto">
                  <Button
                    type="submit"
                    disabled={isSubmittingRsvp}
                    className="uppercase rounded-sm bg-neutral-900 hover:bg-neutral-800 text-neutral-50 text-[10px] md:text-xs leading-4 tracking-[3.2px] w-full flex items-center justify-center gap-2 py-5"
                  >
                    {isSubmittingRsvp ? "Sending..." : "Send Response"}
                    <Send className="size-3" />
                  </Button>
                </CardFooter>
              </form>
            )}
          </Card>
        </section>

        {/* Registry Section */}
        <section className="bg-[oklch(0.97_0.02_20)] flex p-8 md:p-12 flex-col items-center w-full px-4">
          <div className="relative size-28 bg-[radial-gradient(circle,oklch(0.65_0.12_85),oklch(0.55_0.11_75))] shadow-[0_4px_12px_oklch(0.4_0.06_60/0.4)] rounded-full flex mb-4 flex-col justify-center items-center">
            <div className="border-2 border-dashed border-[oklch(0.9_0.06_85/0.6)] rounded-full absolute inset-2" />
            <Gift className="size-8 text-[oklch(0.97_0.02_85)]" />
            <span className="text-[oklch(0.97_0.02_85)] uppercase text-[9px] tracking-[2.4px] mt-1 font-bold">
              Registry
            </span>
          </div>
          <h2 className={`${playfair.className} text-[oklch(0.28_0.02_25)] italic text-2xl md:text-3xl leading-9 mb-2 text-center`}>
            Gift Registry
          </h2>
          <p className="max-w-md leading-relaxed text-center text-neutral-500 text-xs md:text-sm leading-5 mb-6">
            Your presence is the greatest gift of all. Should you wish to honor us with a gift, we have prepared a small registry.
          </p>
          <Button
            className="border-[oklch(0.7_0.1_85)] text-[oklch(0.5_0.05_25)] uppercase rounded-full text-[10px] md:text-xs leading-4 tracking-[3.2px] px-8"
            variant="outline"
          >
            View Our Registry
            <ExternalLink className="size-3" />
          </Button>
        </section>

        {/* Footer */}
        <footer className="bg-neutral-900 text-neutral-50 flex p-8 md:p-12 flex-col items-center w-full text-center">
          <Heart className="size-6 text-[oklch(0.75_0.1_85)] fill-[oklch(0.75_0.1_85)] mb-4" />
          <p className={`${playfair.className} italic text-3xl md:text-4xl leading-10 mb-2`}>
            {name1} {name2 && `& ${name2}`}
          </p>
          <p className="uppercase text-neutral-50/70 text-[10px] md:text-xs leading-4 tracking-[4.8px] md:tracking-[6.4px]">
            {formattedDate} · {event.venue.split("·")[1]?.trim() || event.venue}
          </p>
          <div className="bg-[oklch(0.7_0.1_85)] my-6 w-24 h-px" />
          <p className="text-neutral-50/50 text-[10px] md:text-xs leading-4">
            We can't wait to celebrate with you
          </p>
        </footer>
      </div>
    </div>
  );
}
