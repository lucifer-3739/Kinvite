"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Playfair_Display, Inter } from "next/font/google";
import { Crown, Heart, Phone, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
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

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter",
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

interface Wedding02Props {
  event: EventData;
  initialGuests: GuestData[];
}

export default function Wedding02({ event, initialGuests }: Wedding02Props) {
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
  const [rsvpContact, setRsvpContact] = useState("");
  const [rsvpSeating, setRsvpSeating] = useState("");
  const [rsvpDietary, setRsvpDietary] = useState("");
  const [isSubmittingRsvp, setIsSubmittingRsvp] = useState(false);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rsvpName.trim()) {
      toast.error("Please enter your full name");
      return;
    }
    if (!rsvpContact.trim()) {
      toast.error("Please enter your email or phone number");
      return;
    }

    setIsSubmittingRsvp(true);

    try {
      const response = await createRsvpAction({
        eventId: event.id,
        name: rsvpName,
        phone: rsvpContact,
        relation: rsvpSeating || "General",
        attendance: "yes",
        guestCount: "1",
        side: rsvpDietary || "None",
      });

      if (response.success) {
        setRsvpSubmitted(true);
        toast.success(`Thank you, ${rsvpName}. Your attendance has been confirmed!`);
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
    <div className={`${inter.variable} ${playfair.variable} font-sans`}>
      <div className="bg-white text-neutral-950 w-full min-h-screen max-w-full overflow-x-hidden">
        <div className="min-h-[956px] bg-[#07111f] text-[#f7f1e8]">
          {/* Header */}
          <header className="sticky z-20 backdrop-blur-md bg-[#07111f]/90 border-b border-white/10 top-0">
            <div className="max-w-[1140px] flex mx-auto px-6 md:px-8 py-5 justify-between items-center w-full">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-[#0d1728] text-[#d8b56a] border border-[#d8b56a]/40 flex justify-center items-center">
                  <Crown className="size-5" />
                </div>
                <div className={`${playfair.className} text-[#f7f1e8] text-xl leading-7 tracking-[2.88px]`}>
                  AURUM
                </div>
              </div>
              <nav className="text-white/70 text-sm leading-5 flex items-center gap-6 md:gap-8">
                <a className="font-medium rounded-full bg-white/10 text-[#f7f1e8] px-4 py-2 cursor-pointer">
                  Home
                </a>
                <a className="transition-colors hover:text-white cursor-pointer">Program</a>
                <a className="transition-colors hover:text-white cursor-pointer">Speakers</a>
                <a className="transition-colors hover:text-white cursor-pointer">Sponsors</a>
                <a className="transition-colors hover:text-white cursor-pointer">RSVP</a>
              </nav>
              <Button 
                onClick={() => {
                  const element = document.getElementById("rsvp-section");
                  element?.scrollIntoView({ behavior: "smooth" });
                }}
                className="bg-transparent hover:bg-[#d8b56a]/10 font-semibold rounded-full text-[#f7f1e8] text-sm leading-5 border border-[#d8b56a] px-5 py-2 cursor-pointer transition-colors"
              >
                RSVP
              </Button>
            </div>
          </header>

          <main>
            {/* Hero Section */}
            <section className="relative bg-[#07111f] border-b border-white/10 overflow-hidden px-4">
              <div className="absolute inset-0">
                <Image
                  alt="Ballroom chandelier"
                  className="object-cover opacity-35"
                  src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3OTAzMTh8MHwxfHNlYXJjaHwxfHxjaGFuZGVsaWVyJTIwYmFsbHJvb218ZW58MXx8fHwxNzU0OTI0MjQ0fDA&ixlib=rb-4.1.0&q=80&w=1200"
                  fill
                  sizes="100vw"
                  priority
                />
                <div className="bg-[#07111f]/35 absolute inset-0" />
              </div>
              <div className="relative max-w-[1140px] flex mx-auto pt-24 pb-16 flex-col items-center w-full">
                <div className="font-medium uppercase rounded-full bg-[#d8b56a]/10 text-[#f7f1e8] text-[10px] md:text-xs leading-4 tracking-[3px] md:tracking-[5.6px] border border-[#d8b56a]/40 px-4 py-2">
                  {event.description || "Black-Tie Celebration Gala"}
                </div>
                <div className="max-w-[760px] w-full shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-sm text-center rounded-[28px] bg-[#0b1524]/70 border border-[#d8b56a]/50 mt-10 px-6 md:px-10 py-12">
                  <div className={`${playfair.className} uppercase text-[#d8b56a] text-xs md:text-sm leading-5 tracking-[5px] md:tracking-[7.2px]`}>
                    WELCOME TO
                  </div>
                  <h1 className={`${playfair.className} leading-tight text-[#f7f1e8] text-3xl md:text-6xl mt-4`}>
                    {event.title}
                  </h1>
                  <div className="uppercase text-white/70 text-xs md:text-sm leading-5 tracking-[3px] md:tracking-[4.8px] mt-5">
                    {formattedDate}
                  </div>
                  <div className="text-white/80 text-sm md:text-base leading-6 mt-3">
                    {event.venue}
                  </div>
                  <div className="flex mt-8 justify-center items-center gap-4">
                    <Button 
                      onClick={() => {
                        const element = document.getElementById("rsvp-section");
                        element?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="font-semibold rounded-full bg-[#d8b56a] hover:bg-[#c2a25b] text-[#07111f] text-sm leading-5 px-6 py-3 cursor-pointer transition-colors"
                    >
                      Reserve Your Spot
                    </Button>
                    <Button
                      onClick={() => {
                        const element = document.getElementById("program-section");
                        element?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="bg-transparent hover:bg-white/5 font-semibold rounded-full text-[#f7f1e8] text-sm leading-5 border border-[#d8b56a]/50 px-6 py-3 cursor-pointer transition-colors"
                      variant="outline"
                    >
                      View Program
                    </Button>
                  </div>
                </div>
              </div>
            </section>

            {/* Countdown Section */}
            <section className="bg-[#07111f] border-b border-white/10 px-4">
              <div className="grid max-w-[1140px] mx-auto py-14 gap-8 w-full">
                <div className="text-center">
                  <div className={`${playfair.className} uppercase text-[#d8b56a] text-xs md:text-sm leading-5 tracking-[5px] md:tracking-[7.2px]`}>
                    Countdown
                  </div>
                  <div className={`${playfair.className} text-[#f7f1e8] text-3xl md:text-4xl leading-10 mt-3`}>
                    The Gala Begins In
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 mt-8 gap-4 max-w-3xl mx-auto w-full">
                    <div className="text-center rounded-2xl bg-[#0b1524] border border-[#d8b56a]/30 p-4 md:p-6">
                      <div className={`${playfair.className} text-[#d8b56a] text-3xl md:text-5xl leading-tight`}>
                        {String(timeLeft.days).padStart(2, "0")}
                      </div>
                      <div className="uppercase text-white/60 text-[9px] md:text-xs leading-4 tracking-[3px] md:tracking-[5.6px] mt-2">
                        Days
                      </div>
                    </div>
                    <div className="text-center rounded-2xl bg-[#0b1524] border border-[#d8b56a]/30 p-4 md:p-6">
                      <div className={`${playfair.className} text-[#d8b56a] text-3xl md:text-5xl leading-tight`}>
                        {String(timeLeft.hours).padStart(2, "0")}
                      </div>
                      <div className="uppercase text-white/60 text-[9px] md:text-xs leading-4 tracking-[3px] md:tracking-[5.6px] mt-2">
                        Hours
                      </div>
                    </div>
                    <div className="text-center rounded-2xl bg-[#0b1524] border border-[#d8b56a]/30 p-4 md:p-6">
                      <div className={`${playfair.className} text-[#d8b56a] text-3xl md:text-5xl leading-tight`}>
                        {String(timeLeft.minutes).padStart(2, "0")}
                      </div>
                      <div className="uppercase text-white/60 text-[9px] md:text-xs leading-4 tracking-[3px] md:tracking-[5.6px] mt-2">
                        Minutes
                      </div>
                    </div>
                    <div className="text-center rounded-2xl bg-[#0b1524] border border-[#d8b56a]/30 p-4 md:p-6">
                      <div className={`${playfair.className} text-[#d8b56a] text-3xl md:text-5xl leading-tight`}>
                        {String(timeLeft.seconds).padStart(2, "0")}
                      </div>
                      <div className="uppercase text-white/60 text-[9px] md:text-xs leading-4 tracking-[3px] md:tracking-[5.6px] mt-2">
                        Seconds
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Program Section */}
            <section id="program-section" className="bg-[#07111f] px-4">
              <div className="max-w-[1140px] mx-auto py-16 w-full">
                <div className="text-center">
                  <div className={`${playfair.className} uppercase text-[#d8b56a] text-xs md:text-sm leading-5 tracking-[5px] md:tracking-[7.2px]`}>
                    Program
                  </div>
                  <h2 className={`${playfair.className} text-[#f7f1e8] text-3xl md:text-4xl leading-10 mt-3`}>
                    Evening Schedule
                  </h2>
                </div>
                <div className="grid mt-12 gap-6 max-w-4xl mx-auto w-full">
                  {/* Timeline Event 1 */}
                  <div className="grid grid-cols-[100px_1fr] md:grid-cols-[140px_1fr] items-start gap-4 md:gap-6">
                    <div className={`${playfair.className} text-right text-[#d8b56a] text-xl md:text-2xl leading-8`}>
                      6:00 PM
                    </div>
                    <div className="relative rounded-2xl bg-[#0b1524] border border-white/10 p-5 md:p-6">
                      <div className="size-4 rounded-full bg-[#07111f] border-2 border-[#d8b56a] absolute -left-4 md:-left-4.5 top-8" />
                      <div className="font-semibold text-[#f7f1e8]">Reception</div>
                      <div className="text-white/65 text-xs md:text-sm leading-5 mt-1">
                        Welcoming cocktails and networking reception
                      </div>
                    </div>
                  </div>

                  {/* Timeline Event 2 */}
                  <div className="grid grid-cols-[100px_1fr] md:grid-cols-[140px_1fr] items-start gap-4 md:gap-6">
                    <div className={`${playfair.className} text-right text-[#d8b56a] text-xl md:text-2xl leading-8`}>
                      7:00 PM
                    </div>
                    <div className="relative rounded-2xl bg-[#0b1524] border border-white/10 p-5 md:p-6">
                      <div className="size-4 rounded-full bg-[#07111f] border-2 border-[#d8b56a] absolute -left-4 md:-left-4.5 top-8" />
                      <div className="font-semibold text-[#f7f1e8]">Dinner</div>
                      <div className="text-white/65 text-xs md:text-sm leading-5 mt-1">
                        Gourmet dinner service and introductions
                      </div>
                    </div>
                  </div>

                  {/* Timeline Event 3 */}
                  <div className="grid grid-cols-[100px_1fr] md:grid-cols-[140px_1fr] items-start gap-4 md:gap-6">
                    <div className={`${playfair.className} text-right text-[#d8b56a] text-xl md:text-2xl leading-8`}>
                      8:15 PM
                    </div>
                    <div className="relative rounded-2xl bg-[#0b1524] border border-white/10 p-5 md:p-6">
                      <div className="size-4 rounded-full bg-[#07111f] border-2 border-[#d8b56a] absolute -left-4 md:-left-4.5 top-8" />
                      <div className="font-semibold text-[#f7f1e8]">Address</div>
                      <div className="text-white/65 text-xs md:text-sm leading-5 mt-1">
                        Keynote addresses and presentation of achievements
                      </div>
                    </div>
                  </div>

                  {/* Timeline Event 4 */}
                  <div className="grid grid-cols-[100px_1fr] md:grid-cols-[140px_1fr] items-start gap-4 md:gap-6">
                    <div className={`${playfair.className} text-right text-[#d8b56a] text-xl md:text-2xl leading-8`}>
                      9:30 PM
                    </div>
                    <div className="relative rounded-2xl bg-[#0b1524] border border-white/10 p-5 md:p-6">
                      <div className="size-4 rounded-full bg-[#07111f] border-2 border-[#d8b56a] absolute -left-4 md:-left-4.5 top-8" />
                      <div className="font-semibold text-[#f7f1e8]">Celebration</div>
                      <div className="text-white/65 text-xs md:text-sm leading-5 mt-1">
                        Live music, dessert station, and dancing
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Speakers Section */}
            <section className="bg-[#07111f] px-4">
              <div className="max-w-[1140px] mx-auto py-16 w-full">
                <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-3">
                  <div>
                    <div className={`${playfair.className} uppercase text-[#d8b56a] text-xs md:text-sm leading-5 tracking-[5px] md:tracking-[7.2px]`}>
                      Featured Speakers
                    </div>
                    <h2 className={`${playfair.className} text-[#f7f1e8] text-3xl md:text-4xl leading-10 mt-3`}>
                      Distinguished Voices
                    </h2>
                  </div>
                  <div className="text-white/60 text-xs md:text-sm leading-5">
                    Industry leaders and honored guests
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 mt-10 gap-6">
                  {/* Speaker 1 */}
                  <div className="text-center rounded-3xl bg-[#0b1524] border border-[#d8b56a]/30 p-5">
                    <div className="size-28 rounded-full border-4 border-[#d8b56a] mx-auto overflow-hidden relative">
                      <Image
                        alt="Speaker 1"
                        className="object-cover"
                        src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3OTAzMTh8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBoZWFkc2hvdCUyMG1hbnxlbnwxfHx8fDE3NTQ5MjQyOTB8MA&ixlib=rb-4.1.0&q=80&w=400"
                        fill
                        sizes="112px"
                      />
                    </div>
                    <div className="font-semibold text-[#f7f1e8] mt-4">Evelyn Hart</div>
                    <div className="text-white/60 text-xs md:text-sm leading-5 mt-1">Chief Executive Officer</div>
                  </div>

                  {/* Speaker 2 */}
                  <div className="text-center rounded-3xl bg-[#0b1524] border border-[#d8b56a]/30 p-5">
                    <div className="size-28 rounded-full border-4 border-[#d8b56a] mx-auto overflow-hidden relative">
                      <Image
                        alt="Speaker 2"
                        className="object-cover"
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3OTAzMTh8MHwxfHNlYXJjaHwxfHxjb3VwbGUlMjBsYXVnaGluZyUyMHdlZGRpbmclMjBwb3J0cmFpdHxlbnwxfDJ8fHwxNzgzNDE4Mzc4fDA&ixlib=rb-4.1.0&q=80&w=400"
                        fill
                        sizes="112px"
                      />
                    </div>
                    <div className="font-semibold text-[#f7f1e8] mt-4">Maya Chen</div>
                    <div className="text-white/60 text-xs md:text-sm leading-5 mt-1">Global Strategy Director</div>
                  </div>

                  {/* Speaker 3 */}
                  <div className="text-center rounded-3xl bg-[#0b1524] border border-[#d8b56a]/30 p-5">
                    <div className="size-28 rounded-full border-4 border-[#d8b56a] mx-auto overflow-hidden relative">
                      <Image
                        alt="Speaker 3"
                        className="object-cover"
                        src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3OTAzMTh8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBoZWFkc2hvdCUyMG1hbnxlbnwxfHx8fDE3NTQ5MjQyOTB8MQ&ixlib=rb-4.1.0&q=80&w=400"
                        fill
                        sizes="112px"
                      />
                    </div>
                    <div className="font-semibold text-[#f7f1e8] mt-4">Daniel Brooks</div>
                    <div className="text-white/60 text-xs md:text-sm leading-5 mt-1">Board Chairman</div>
                  </div>

                  {/* Speaker 4 */}
                  <div className="text-center rounded-3xl bg-[#0b1524] border border-[#d8b56a]/30 p-5">
                    <div className="size-28 rounded-full border-4 border-[#d8b56a] mx-auto overflow-hidden relative">
                      <Image
                        alt="Speaker 4"
                        className="object-cover"
                        src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3OTAzMTh8MHwxfHNlYXJjaHwxfHxjb3VwbGUlMjBoZWFkc2hvdCUyMHdvbWFufGVufDF8fHx8MTc1NDkyNDI5MHwx&ixlib=rb-4.1.0&q=80&w=400"
                        fill
                        sizes="112px"
                      />
                    </div>
                    <div className="font-semibold text-[#f7f1e8] mt-4">Sophia Laurent</div>
                    <div className="text-white/60 text-xs md:text-sm leading-5 mt-1">VP, Corporate Affairs</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Sponsors Section */}
            <section className="bg-[#07111f] px-4">
              <div className="max-w-[1140px] mx-auto py-16 w-full">
                <div className="text-center">
                  <div className={`${playfair.className} uppercase text-[#d8b56a] text-xs md:text-sm leading-5 tracking-[5px] md:tracking-[7.2px]`}>
                    Our Sponsors
                  </div>
                  <h2 className={`${playfair.className} text-[#f7f1e8] text-3xl md:text-4xl leading-10 mt-3`}>
                    Partners of the Evening
                  </h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 mt-10 gap-4 max-w-4xl mx-auto w-full font-semibold">
                  <div className="uppercase rounded-2xl bg-white/5 text-white/55 text-xs md:text-sm leading-5 tracking-[4px] md:tracking-[5.6px] border border-white/10 flex justify-center items-center h-20 md:h-24">
                    Northstar
                  </div>
                  <div className="uppercase rounded-2xl bg-white/5 text-white/55 text-xs md:text-sm leading-5 tracking-[4px] md:tracking-[5.6px] border border-white/10 flex justify-center items-center h-20 md:h-24">
                    Apex
                  </div>
                  <div className="uppercase rounded-2xl bg-white/5 text-white/55 text-xs md:text-sm leading-5 tracking-[4px] md:tracking-[5.6px] border border-white/10 flex justify-center items-center h-20 md:h-24">
                    Monarch
                  </div>
                  <div className="uppercase rounded-2xl bg-white/5 text-white/55 text-xs md:text-sm leading-5 tracking-[4px] md:tracking-[5.6px] border border-white/10 flex justify-center items-center h-20 md:h-24">
                    Summit
                  </div>
                  <div className="uppercase rounded-2xl bg-white/5 text-white/55 text-xs md:text-sm leading-5 tracking-[4px] md:tracking-[5.6px] border border-white/10 flex justify-center items-center h-20 md:h-24">
                    Crest
                  </div>
                  <div className="uppercase rounded-2xl bg-white/5 text-white/55 text-xs md:text-sm leading-5 tracking-[4px] md:tracking-[5.6px] border border-white/10 flex justify-center items-center h-20 md:h-24">
                    Vertex
                  </div>
                  <div className="uppercase rounded-2xl bg-white/5 text-white/55 text-xs md:text-sm leading-5 tracking-[4px] md:tracking-[5.6px] border border-white/10 flex justify-center items-center h-20 md:h-24">
                    Lumen
                  </div>
                  <div className="uppercase rounded-2xl bg-white/5 text-white/55 text-xs md:text-sm leading-5 tracking-[4px] md:tracking-[5.6px] border border-white/10 flex justify-center items-center h-20 md:h-24">
                    Atlas
                  </div>
                </div>
              </div>
            </section>

            {/* RSVP & Venue Section */}
            <section id="rsvp-section" className="bg-[#07111f] px-4 pb-20">
              <div className="max-w-[1140px] mx-auto w-full">
                <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-8">
                  {/* RSVP Form */}
                  <Card className="bg-[#0b1524] text-[#f7f1e8] border border-[#d8b56a]/25 p-6 md:p-8 flex flex-col justify-between">
                    {rsvpSubmitted ? (
                      <div className="text-center py-16 flex flex-col items-center justify-center gap-4">
                        <div className="size-16 bg-emerald-500/10 rounded-full flex items-center justify-center">
                          <Check className="size-8 text-emerald-500" />
                        </div>
                        <h3 className={`${playfair.className} text-[#f7f1e8] text-xl font-bold`}>
                          Reservation Confirmed!
                        </h3>
                        <p className="text-sm text-white/60">
                          Thank you. Your attendance details have been successfully saved.
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleRsvpSubmit} className="flex flex-col gap-6 h-full font-semibold">
                        <CardHeader className="p-0 gap-2">
                          <div className={`${playfair.className} uppercase text-[#d8b56a] text-xs md:text-sm leading-5 tracking-[5px] md:tracking-[7.2px]`}>
                            RSVP
                          </div>
                          <div className={`${playfair.className} text-2xl md:text-4xl leading-10 text-white`}>
                            Confirm Attendance
                          </div>
                          <div className="text-white/60 text-xs md:text-sm leading-5">
                            Please submit your details below
                          </div>
                        </CardHeader>
                        <CardContent className="p-0 gap-4 flex flex-col">
                          <div className="grid gap-2">
                            <label className="text-white/75 text-xs md:text-sm leading-5">Name</label>
                            <Input
                              className="bg-white/5 text-[#f7f1e8] border-white/10 rounded-lg text-xs"
                              placeholder="Your full name"
                              value={rsvpName}
                              onChange={(e) => setRsvpName(e.target.value)}
                              required
                            />
                          </div>
                          <div className="grid gap-2">
                            <label className="text-white/75 text-xs md:text-sm leading-5">Email or Phone</label>
                            <Input
                              className="bg-white/5 text-[#f7f1e8] border-white/10 rounded-lg text-xs"
                              placeholder="you@example.com"
                              value={rsvpContact}
                              onChange={(e) => setRsvpContact(e.target.value)}
                              required
                            />
                          </div>
                          <div className="grid gap-2">
                            <label className="text-white/75 text-xs md:text-sm leading-5">Seating Preference</label>
                            <Input
                              className="bg-white/5 text-[#f7f1e8] border-white/10 rounded-lg text-xs"
                              placeholder="e.g. VIP, Table 5, Executive"
                              value={rsvpSeating}
                              onChange={(e) => setRsvpSeating(e.target.value)}
                            />
                          </div>
                          <div className="grid gap-2">
                            <label className="text-white/75 text-xs md:text-sm leading-5">Dietary Requirements</label>
                            <textarea
                              className="min-h-24 bg-white/5 text-[#f7f1e8] border border-white/10 rounded-lg text-xs p-3 w-full focus:outline-none focus:border-[#d8b56a]/50"
                              placeholder="Allergies, vegetarian, etc."
                              value={rsvpDietary}
                              onChange={(e) => setRsvpDietary(e.target.value)}
                            />
                          </div>
                        </CardContent>
                        <CardFooter className="p-0 mt-4">
                          <Button 
                            type="submit"
                            disabled={isSubmittingRsvp}
                            className="font-semibold rounded-full bg-[#d8b56a] hover:bg-[#c2a25b] text-[#07111f] py-4 w-full cursor-pointer transition-colors"
                          >
                            {isSubmittingRsvp ? "Submitting..." : "Submit RSVP"}
                          </Button>
                        </CardFooter>
                      </form>
                    )}
                  </Card>

                  {/* Venue card */}
                  <div className="rounded-[28px] bg-[#0b1524] text-[#f7f1e8] border border-white/10 p-6 md:p-8 flex flex-col justify-between">
                    <div>
                      <div className={`${playfair.className} uppercase text-[#d8b56a] text-xs md:text-sm leading-5 tracking-[5px] md:tracking-[7.2px]`}>
                        Venue
                      </div>
                      <div className={`${playfair.className} text-2xl md:text-4xl leading-10 mt-3 text-white`}>
                        {event.venue.split(",")[0].trim()}
                      </div>
                      <div className="text-white/60 text-xs md:text-sm leading-5 mt-2">
                        {event.venue}
                      </div>
                      <div className="rounded-2xl border border-white/10 mt-6 overflow-hidden relative h-64 md:h-80">
                        <Image
                          alt="Venue map"
                          className="object-cover"
                          src="https://screens-image-components-public.s3.eu-north-1.amazonaws.com/city-navigation-map.png"
                          fill
                          sizes="(max-width: 768px) 100vw, 400px"
                        />
                      </div>
                    </div>
                    <div className="text-white/70 text-xs md:text-sm leading-5 flex mt-6 items-center gap-3">
                      <Phone className="size-4 text-[#d8b56a]" />
                      <span>Contact: +1 (555) 123-4567</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </main>

          {/* Footer */}
          <footer className="bg-[#050b14] border-t border-white/10">
            <div className="max-w-[1140px] text-white/60 text-xs md:text-sm leading-5 flex flex-col md:flex-row mx-auto p-8 justify-between items-center w-full gap-4 text-center md:text-left">
              <div>
                <div className={`${playfair.className} text-[#f7f1e8] text-base md:text-lg leading-7`}>
                  {event.title}
                </div>
                <div className="mt-1">
                  {formattedDate} · {event.venue}
                </div>
              </div>
              <div className="text-[#d8b56a] flex items-center gap-2">
                <Heart className="size-4 fill-[#d8b56a]" />
                <span>Elegant evenings, lasting impact</span>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
