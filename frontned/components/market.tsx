/**
 * v0 by Vercel.
 * @see https://v0.dev/t/UMtSOiFwJ8l
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu"

export default function Market() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <header className="bg-primary text-primary-foreground py-4 px-6 flex items-center justify-between">
        <Link href="#" className="flex items-center gap-2 font-semibold text-lg" prefetch={false}>
          <TicketIcon className="h-6 w-6" />
          <span>Ticket Marketplace</span>
        </Link>
        <nav className="hidden md:flex items-center gap-4">
          <Link href="#" className="hover:underline" prefetch={false}>
            Events
          </Link>
          <Link href="#" className="hover:underline" prefetch={false}>
            Sell Tickets
          </Link>
          <Link href="#" className="hover:underline" prefetch={false}>
            Dashboard
          </Link>
          <Button variant="outline">Sign In</Button>
        </nav>
        <Button size="icon" variant="ghost" className="md:hidden">
          <MenuIcon className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </header>
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="ghost" className="md:hidden">
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="md:hidden">
          <nav className="grid gap-4 p-4">
            <Link href="#" className="hover:underline" prefetch={false}>
              Events
            </Link>
            <Link href="#" className="hover:underline" prefetch={false}>
              Sell Tickets
            </Link>
            <Link href="#" className="hover:underline" prefetch={false}>
              Dashboard
            </Link>
            <Button>Sign In</Button>
          </nav>
        </SheetContent>
      </Sheet>
      <main className="flex-1">
        <section className="bg-muted py-12 md:py-20">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 md:grid-cols-2 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Discover and Attend the Best Events
                </h1>
                <p className="text-muted-foreground md:text-xl">
                  Find and purchase tickets to the hottest concerts, festivals, and more on our secure marketplace.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input type="search" placeholder="Search events..." className="flex-1" />
                  <Button>Search</Button>
                </div>
              </div>
              <img src="/placeholder.svg" width={600} height={400} alt="Hero Image" className="rounded-xl" />
            </div>
          </div>
        </section>
        <section className="py-12 md:py-20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-6">
              <div className="space-y-2 text-center">
                <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl">Featured Events</h2>
                <p className="text-muted-foreground md:text-lg">
                  Check out some of the hottest events on our platform.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <Card>
                  <img
                    src="/placeholder.svg"
                    width={300}
                    height={200}
                    alt="Event Image"
                    className="rounded-t-lg object-cover w-full aspect-[3/2]"
                  />
                  <CardContent className="p-4 space-y-2">
                    <h3 className="font-semibold text-lg">Music Festival</h3>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CalendarIcon className="h-4 w-4" />
                      <span>June 15-17, 2023</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPinIcon className="h-4 w-4" />
                      <span>New York, NY</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <StarIcon className="h-4 w-4 fill-primary" />
                      <span>4.8 (125 reviews)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="font-semibold">$99</div>
                      <Button size="sm">Buy Tickets</Button>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <img
                    src="/placeholder.svg"
                    width={300}
                    height={200}
                    alt="Event Image"
                    className="rounded-t-lg object-cover w-full aspect-[3/2]"
                  />
                  <CardContent className="p-4 space-y-2">
                    <h3 className="font-semibold text-lg">Comedy Show</h3>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CalendarIcon className="h-4 w-4" />
                      <span>July 1, 2023</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPinIcon className="h-4 w-4" />
                      <span>Los Angeles, CA</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <StarIcon className="h-4 w-4 fill-primary" />
                      <span>4.5 (80 reviews)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="font-semibold">$25</div>
                      <Button size="sm">Buy Tickets</Button>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <img
                    src="/placeholder.svg"
                    width={300}
                    height={200}
                    alt="Event Image"
                    className="rounded-t-lg object-cover w-full aspect-[3/2]"
                  />
                  <CardContent className="p-4 space-y-2">
                    <h3 className="font-semibold text-lg">Tech Conference</h3>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CalendarIcon className="h-4 w-4" />
                      <span>September 10-12, 2023</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPinIcon className="h-4 w-4" />
                      <span>San Francisco, CA</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <StarIcon className="h-4 w-4 fill-primary" />
                      <span>4.7 (150 reviews)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="font-semibold">$199</div>
                      <Button size="sm">Buy Tickets</Button>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <img
                    src="/placeholder.svg"
                    width={300}
                    height={200}
                    alt="Event Image"
                    className="rounded-t-lg object-cover w-full aspect-[3/2]"
                  />
                  <CardContent className="p-4 space-y-2">
                    <h3 className="font-semibold text-lg">Art Exhibition</h3>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CalendarIcon className="h-4 w-4" />
                      <span>August 1-31, 2023</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPinIcon className="h-4 w-4" />
                      <span>Chicago, IL</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <StarIcon className="h-4 w-4 fill-primary" />
                      <span>4.9 (200 reviews)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="font-semibold">$15</div>
                      <Button size="sm">Buy Tickets</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
        <section className="bg-muted py-12 md:py-20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-6">
              <div className="space-y-2 text-center">
                <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl">Search and Filter Events</h2>
                <p className="text-muted-foreground md:text-lg">
                  Find the perfect event for you using our advanced search and filtering tools.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                <Input type="search" placeholder="Search events..." className="flex-1" />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex-1">
                      <FilterIcon className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-[300px]">
                    <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem checked>Date</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>Location</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>Category</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>Price</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>Popularity</DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button>Search</Button>
              </div>
            </div>
          </div>
        </section>
        <section className="py-12 md:py-20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-6">
              <div className="space-y-2 text-center">
                <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl">Upcoming Events</h2>
                <p className="text-muted-foreground md:text-lg">Check out the latest events happening in your area.</p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
                <Card>
                  <img
                    src="/placeholder.svg"
                    width={300}
                    height={200}
                    alt="Event Image"
                    className="rounded-t-lg object-cover w-full aspect-[3/2]"
                  />
                  <CardContent className="p-4 space-y-2">
                    <h3 className="font-semibold text-lg">Music Festival</h3>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CalendarIcon className="h-4 w-4" />
                      <span>June 15-17, 2023</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPinIcon className="h-4 w-4" />
                      <span>New York, NY</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <StarIcon className="h-4 w-4 fill-primary" />
                      <span>4.8 (125 reviews)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="font-semibold">$99</div>
                      <Button size="sm">Buy Tickets</Button>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <img
                    src="/placeholder.svg"
                    width={300}
                    height={200}
                    alt="Event Image"
                    className="rounded-t-lg object-cover w-full aspect-[3/2]"
                  />
                  <CardContent className="p-4 space-y-2">
                    <h3 className="font-semibold text-lg">Comedy Show</h3>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CalendarIcon className="h-4 w-4" />
                      <span>July 1, 2023</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPinIcon className="h-4 w-4" />
                      <span>Los Angeles, CA</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <StarIcon className="h-4 w-4 fill-primary" />
                      <span>4.5 (80 reviews)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="font-semibold">$25</div>
                      <Button size="sm">Buy Tickets</Button>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <img
                    src="/placeholder.svg"
                    width={300}
                    height={200}
                    alt="Event Image"
                    className="rounded-t-lg object-cover w-full aspect-[3/2]"
                  />
                  <CardContent className="p-4 space-y-2">
                    <h3 className="font-semibold text-lg">Tech Conference</h3>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

function CalendarIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  )
}


function FilterIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  )
}


function MapPinIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}


function MenuIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  )
}


function StarIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}


function TicketIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M13 5v2" />
      <path d="M13 17v2" />
      <path d="M13 11v2" />
    </svg>
  )
}