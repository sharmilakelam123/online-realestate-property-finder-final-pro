import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "dns";
import Property from "../models/Property.js";

dotenv.config();

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const IMAGE_POOLS = {
  apartment: [
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1515263487990-61b07816b7d2?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80",
  ],

  villa: [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80",
  ],

  "independent-house": [
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80",
  ],

  plot: [
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1592595896551-12b371d546d5?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1560185008-b033106af5c3?auto=format&fit=crop&w=1200&q=80",
  ],

  office: [
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80",
  ],

  shop: [
    "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=1200&q=80",
  ],

  "builder-floor": [
    "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
  ],
};

const LOCATIONS = [
  {
    city: "Hyderabad",
    localities: [
      "Kondapur",
      "Gachibowli",
      "Kukatpally",
      "Madhapur",
      "Miyapur",
      "Manikonda",
      "Banjara Hills",
      "Jubilee Hills",
      "Nallagandla",
      "Hitech City",
    ],
  },
  {
    city: "Bangalore",
    localities: [
      "Whitefield",
      "Electronic City",
      "Koramangala",
      "Marathahalli",
      "HSR Layout",
      "Indiranagar",
      "Hebbal",
      "Yelahanka",
      "Sarjapur Road",
      "Bellandur",
    ],
  },
  {
    city: "Visakhapatnam",
    localities: [
      "Madhurawada",
      "Gajuwaka",
      "Rushikonda",
      "MVP Colony",
      "Seethammadhara",
      "Dwaraka Nagar",
      "Akkayyapalem",
      "Yendada",
    ],
  },
  {
    city: "Mumbai",
    localities: [
      "Andheri",
      "Bandra",
      "Powai",
      "Thane",
      "Borivali",
      "Goregaon",
      "Mulund",
      "Chembur",
    ],
  },
  {
    city: "Delhi",
    localities: [
      "Dwarka",
      "Rohini",
      "Saket",
      "Vasant Kunj",
      "Greater Kailash",
      "Mayur Vihar",
      "Pitampura",
      "Janakpuri",
    ],
  },
  {
    city: "Chennai",
    localities: [
      "OMR",
      "Velachery",
      "Adyar",
      "Anna Nagar",
      "Porur",
      "Sholinganallur",
      "Tambaram",
      "T Nagar",
    ],
  },
  {
    city: "Pune",
    localities: [
      "Hinjewadi",
      "Baner",
      "Wakad",
      "Kharadi",
      "Viman Nagar",
      "Hadapsar",
      "Kothrud",
      "Aundh",
    ],
  },
  {
    city: "Srikakulam",
    localities: [
      "Srikakulam Town",
      "Palakonda",
      "Amadalavalasa",
      "Etcherla",
      "Narasannapeta",
    ],
  },
];

const CATEGORIES = [
  "apartment",
  "villa",
  "independent-house",
  "plot",
  "office",
  "shop",
  "builder-floor",
];

const CITY_COORDS = {
  Hyderabad: { lat: 17.385, lng: 78.4867 },
  Bangalore: { lat: 12.9716, lng: 77.5946 },
  Visakhapatnam: { lat: 17.6868, lng: 83.2185 },
  Mumbai: { lat: 19.076, lng: 72.8777 },
  Delhi: { lat: 28.6139, lng: 77.209 },
  Chennai: { lat: 13.0827, lng: 80.2707 },
  Pune: { lat: 18.5204, lng: 73.8567 },
  Srikakulam: { lat: 18.2969, lng: 83.8973 },
};

const AMENITIES = [
  "Lift",
  "Power Backup",
  "Security",
  "Car Parking",
  "Water Supply",
  "Gym",
  "Swimming Pool",
  "Children Play Area",
  "CCTV",
  "Club House",
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function jitterCoord(value) {
  return Number(
    (value + (Math.random() - 0.5) * 0.08).toFixed(6)
  );
}

function makeTitle(category, bedrooms, locality) {
  const titles = {
    apartment: [
      `Premium ${bedrooms} BHK Apartment in ${locality}`,
      `Modern ${bedrooms} BHK Apartment in ${locality}`,
      `Spacious ${bedrooms} BHK Flat in ${locality}`,
      `Luxury ${bedrooms} BHK Apartment in ${locality}`,
    ],

    villa: [
      `Luxury Villa in ${locality}`,
      `Premium Independent Villa in ${locality}`,
      `Modern Villa for Sale in ${locality}`,
      `Spacious Family Villa in ${locality}`,
    ],

    "independent-house": [
      `Independent House in ${locality}`,
      `Spacious Family House in ${locality}`,
      `Premium Independent Home in ${locality}`,
      `Modern House for Sale in ${locality}`,
    ],

    plot: [
      `Residential Plot in ${locality}`,
      `Premium Residential Site in ${locality}`,
      `HMDA Residential Plot in ${locality}`,
      `Open Plot for Sale in ${locality}`,
    ],

    office: [
      `Commercial Office Space in ${locality}`,
      `Premium Office Space in ${locality}`,
      `Ready to Move Office in ${locality}`,
      `Modern Commercial Office in ${locality}`,
    ],

    shop: [
      `Commercial Shop in ${locality}`,
      `Prime Retail Shop in ${locality}`,
      `Main Road Shop in ${locality}`,
      `Commercial Retail Space in ${locality}`,
    ],

    "builder-floor": [
      `Premium Builder Floor in ${locality}`,
      `Modern Builder Floor in ${locality}`,
      `Spacious Builder Floor in ${locality}`,
      `Ready Builder Floor in ${locality}`,
    ],
  };

  return pick(titles[category]);
}

function makeDescription(
  category,
  bedrooms,
  areaSqft,
  locality,
  city
) {
  if (category === "plot") {
    return `Residential plot available in ${locality}, ${city}. Suitable for residential construction and investment. Clear location with good connectivity to nearby roads, schools, hospitals and daily necessities.`;
  }

  if (category === "office") {
    return `Well-maintained commercial office space available in ${locality}, ${city}. Suitable for startups, companies, consultants and professional offices with good connectivity and nearby commercial facilities.`;
  }

  if (category === "shop") {
    return `Commercial shop available in ${locality}, ${city}. Suitable for retail, showroom or business use. Located in a developing commercial area with convenient access and nearby residential communities.`;
  }

  return `Beautiful ${bedrooms} BHK ${category.replace(
    "-",
    " "
  )} property available in ${locality}, ${city}. Approximate area is ${areaSqft} sq.ft. The property offers good connectivity, comfortable living space and access to nearby schools, hospitals, shopping areas and transport facilities.`;
}

async function seed({ count = 60, wipe = false } = {}) {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in .env file");
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("DB Connected Successfully");

    // Existing properties will NOT be deleted.
    if (wipe) {
      await Property.deleteMany({});
      console.log("Existing properties deleted");
    }

    const docs = [];

    for (let i = 0; i < count; i++) {
      const locationGroup = pick(LOCATIONS);
      const city = locationGroup.city;
      const locality = pick(locationGroup.localities);

      const category = pick(CATEGORIES);

      const isPlot = category === "plot";
      const isCommercial =
        category === "office" || category === "shop";

      const bedrooms = isPlot
        ? 0
        : isCommercial
        ? randInt(0, 1)
        : randInt(1, 5);

      const bathrooms = isPlot
        ? 0
        : isCommercial
        ? randInt(1, 2)
        : Math.max(1, Math.min(4, bedrooms));

      let areaSqft;

      if (isPlot) {
        areaSqft = randInt(1000, 6000);
      } else if (category === "villa") {
        areaSqft = randInt(1800, 4500);
      } else if (category === "independent-house") {
        areaSqft = randInt(1200, 3200);
      } else if (category === "office") {
        areaSqft = randInt(600, 5000);
      } else if (category === "shop") {
        areaSqft = randInt(300, 2500);
      } else {
        areaSqft = randInt(700, 2800);
      }

      const listingType =
        Math.random() < 0.3 ? "rent" : "sale";

      let price;

      if (listingType === "rent") {
        if (isCommercial) {
          price = randInt(15000, 150000);
        } else {
          price = randInt(12000, 85000);
        }
      } else {
        if (isPlot) {
          price = randInt(2500000, 25000000);
        } else if (category === "villa") {
          price = randInt(8000000, 50000000);
        } else if (category === "independent-house") {
          price = randInt(5500000, 30000000);
        } else if (isCommercial) {
          price = randInt(3500000, 35000000);
        } else {
          price = randInt(3000000, 25000000);
        }
      }

      const coords = CITY_COORDS[city];

      const selectedAmenities = [
        ...new Set(
          Array.from(
            { length: randInt(3, 6) },
            () => pick(AMENITIES)
          )
        ),
      ];

      const imagePool =
        IMAGE_POOLS[category] || IMAGE_POOLS.apartment;

      const image = pick(imagePool);

      const title = makeTitle(
        category,
        bedrooms || 1,
        locality
      );

      const description = makeDescription(
        category,
        bedrooms || 1,
        areaSqft,
        locality,
        city
      );

      docs.push({
        title,
        description,

        listingType,
        price,

        location: `${locality}, ${city}`,
        city,
        locality,

        coordinates: {
          lat: jitterCoord(coords.lat),
          lng: jitterCoord(coords.lng),
        },

        image,
        images: [image],

        bedrooms,
        bathrooms,
        areaSqft,
        area: areaSqft,

        category,

        verified: Math.random() < 0.8,
        featured: Math.random() < 0.25,

        // IMPORTANT:
        // These values exactly match Property.js enum.
        furnishing:
          category === "plot"
            ? "unfurnished"
            : pick([
                "unfurnished",
                "semi-furnished",
                "fully-furnished",
              ]),

        parking: isPlot ? 0 : randInt(1, 2),

        amenities: selectedAmenities,

        reraId:
          listingType === "sale" && !isPlot
            ? `RERA-${city
                .toUpperCase()
                .replace(/\s+/g, "")}-${randInt(
                10000,
                99999
              )}`
            : "",

        advertiserType: pick([
          "owner",
          "dealer",
          "builder",
        ]),
      });
    }

    const inserted = await Property.insertMany(docs);

    console.log(
      `Successfully added ${inserted.length} properties`
    );

    const total = await Property.countDocuments();

    console.log(
      `Total properties currently in database: ${total}`
    );

    await mongoose.disconnect();

    console.log("Database disconnected");
  } catch (error) {
    console.error("Seed error:", error);

    try {
      await mongoose.disconnect();
    } catch {}

    process.exitCode = 1;
  }
}

const args = process.argv.slice(2);

const countArg = args.find((a) =>
  a.startsWith("--count=")
);

// Existing data will NOT be deleted.
const wipe = false;

// Add 60 new properties by default.
const count = countArg
  ? Number(countArg.split("=")[1])
  : 60;

seed({ count, wipe }).catch((err) => {
  console.error(err);
  process.exitCode = 1;
});