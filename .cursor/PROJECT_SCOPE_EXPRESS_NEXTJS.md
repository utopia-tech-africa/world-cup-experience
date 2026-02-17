# World Cup Experience Booking Platform - Project Scope

## Project Overview

A full-stack web application for Altair Logistics that enables customers to book World Cup travel packages with flight tickets, accommodation, and optional add-ons. The platform includes a customer-facing booking interface and an admin dashboard for managing bookings and payment verification.

---

## Core Functionality

### Customer-Facing Features
1. **Package Selection System**
   - Display two package options (Single Game / Double Game)
   - Show pricing for Hotel and Hostel accommodation types
   - Package details: dates, games, duration

2. **Optional Add-Ons**
   - Merch Bundle (scarf/cap/flag kit)
   - PHL Airport Shuttle (round trip)
   - Premium Match-Day Priority Transfers
   - Private Delegation SUV
   - Lunch/Dinner Meal Add-on
   - Dynamic price calculation based on selections

3. **Booking Form**
   - Personal information (name, email, phone)
   - Passport details (number, expiry date)
   - Number of travelers
   - Special requests (optional)
   - Real-time form validation

4. **Payment System**
   - Display Local/International bank account details
   - Toggle between account types
   - File upload for payment proof (JPG, PNG, PDF)
   - Show total amount (base package + add-ons)

5. **Email Notifications**
   - Submission confirmation (automatic)
   - Booking confirmation (admin-triggered)
   - Booking rejection with custom message (admin-triggered)

### Admin Dashboard Features
1. **Booking Management**
   - View all bookings with filters (Pending/Confirmed/Rejected)
   - Search by booking ID, customer name, or date
   - View detailed booking information including add-ons
   - Download/view payment proof

2. **Payment Verification**
   - Review payment proof images/PDFs
   - Confirm or reject bookings
   - Add custom rejection messages

3. **Status Management**
   - Update booking status
   - Trigger confirmation/rejection emails
   - Track booking history

---

## Technical Stack

### Frontend (Next.js)
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui (optional) or custom components
- **Form Handling:** React Hook Form with Zod validation
- **State Management:** React Context API or Zustand (for global state)
- **Data Fetching:** TanStack Query (React Query) v5
- **HTTP Client:** Axios
- **File Upload:** React Dropzone with Axios

### Backend (Express.js)
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT with bcrypt
- **Email Service:** Nodemailer with SMTP or Resend
- **File Storage:** AWS S3, Cloudinary, or Multer + local storage
- **Validation:** Zod
- **Middleware:** 
  - cors (for Cross-Origin requests)
  - helmet (security headers)
  - express-rate-limit (rate limiting)
  - multer (file uploads)

### Database
- **Primary DB:** PostgreSQL
- **ORM:** Prisma
- **Schema:**
  - Users (admin accounts)
  - Bookings
  - AddOns
  - BookingAddOns (junction table)

### Infrastructure
- **Frontend Hosting:** Vercel
- **Backend Hosting:** Railway, Render, or AWS EC2
- **Database:** Railway Postgres, Supabase, Neon, or self-hosted
- **File Storage:** AWS S3 or Cloudinary
- **Email:** Resend, SendGrid, or AWS SES
- **SSL:** Automatic via hosting platforms

---

## Project Structure

```
world-cup-booking/
├── frontend/                        # Next.js Frontend
│   ├── public/
│   │   ├── images/
│   │   │   ├── packages/
│   │   │   └── addons/
│   │   └── favicon.ico
│   │
│   ├── src/
│   │   ├── app/                     # Next.js App Router
│   │   │   ├── (customer)/          # Customer-facing routes
│   │   │   │   ├── page.tsx         # Home/Landing page
│   │   │   │   ├── booking/
│   │   │   │   │   └── page.tsx     # Booking form page
│   │   │   │   ├── success/
│   │   │   │   │   └── page.tsx     # Submission success page
│   │   │   │   └── layout.tsx       # Customer layout
│   │   │   │
│   │   │   ├── admin/               # Admin dashboard routes
│   │   │   │   ├── login/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── dashboard/
│   │   │   │   │   └── page.tsx     # Bookings list
│   │   │   │   ├── bookings/
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx # Booking details
│   │   │   │   └── layout.tsx       # Admin layout
│   │   │   │
│   │   │   ├── layout.tsx           # Root layout
│   │   │   └── globals.css          # Global styles
│   │   │
│   │   ├── components/
│   │   │   ├── ui/                  # Base UI components
│   │   │   │   ├── button.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── select.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   └── toast.tsx
│   │   │   ├── customer/            # Customer components
│   │   │   │   ├── PackageCard.tsx
│   │   │   │   ├── PackageSelector.tsx
│   │   │   │   ├── AddOnSelector.tsx
│   │   │   │   ├── BookingForm.tsx
│   │   │   │   ├── PaymentDetails.tsx
│   │   │   │   ├── PriceSummary.tsx
│   │   │   │   └── FileUploader.tsx
│   │   │   ├── admin/               # Admin components
│   │   │   │   ├── BookingList.tsx
│   │   │   │   ├── BookingCard.tsx
│   │   │   │   ├── BookingDetail.tsx
│   │   │   │   ├── PaymentProofViewer.tsx
│   │   │   │   ├── StatusBadge.tsx
│   │   │   │   ├── ConfirmModal.tsx
│   │   │   │   └── RejectModal.tsx
│   │   │   └── common/              # Shared components
│   │   │       ├── Header.tsx
│   │   │       ├── Footer.tsx
│   │   │       ├── LoadingSpinner.tsx
│   │   │       └── ErrorMessage.tsx
│   │   │
│   │   ├── lib/
│   │   │   ├── axios.ts             # Axios instance with interceptors
│   │   │   ├── queryClient.ts       # TanStack Query client config
│   │   │   └── utils.ts             # Helper functions
│   │   │
│   │   ├── hooks/
│   │   │   ├── queries/             # TanStack Query hooks
│   │   │   │   ├── usePackages.ts
│   │   │   │   ├── useAddons.ts
│   │   │   │   ├── useBookings.ts
│   │   │   │   └── useBookingDetail.ts
│   │   │   ├── mutations/           # TanStack Mutation hooks
│   │   │   │   ├── useCreateBooking.ts
│   │   │   │   ├── useConfirmBooking.ts
│   │   │   │   ├── useRejectBooking.ts
│   │   │   │   └── useUploadFile.ts
│   │   │   ├── useAuth.ts
│   │   │   └── useLocalStorage.ts
│   │   │
│   │   ├── services/                # API service functions
│   │   │   ├── api.ts               # Base API utilities
│   │   │   ├── packageService.ts
│   │   │   ├── addonService.ts
│   │   │   ├── bookingService.ts
│   │   │   ├── adminService.ts
│   │   │   └── authService.ts
│   │   │
│   │   ├── types/
│   │   │   ├── booking.ts
│   │   │   ├── addon.ts
│   │   │   ├── package.ts
│   │   │   ├── admin.ts
│   │   │   └── api.ts
│   │   │
│   │   ├── constants/
│   │   │   ├── packages.ts
│   │   │   └── apiEndpoints.ts
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   │
│   │   └── providers/
│   │       └── QueryProvider.tsx    # TanStack Query Provider
│   │
│   ├── .env.local
│   ├── .env.example
│   ├── next.config.js
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── package.json
│
├── backend/                         # Express.js Backend
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── booking.controller.ts
│   │   │   ├── admin.controller.ts
│   │   │   ├── auth.controller.ts
│   │   │   └── addon.controller.ts
│   │   │
│   │   ├── routes/
│   │   │   ├── booking.routes.ts
│   │   │   ├── admin.routes.ts
│   │   │   ├── auth.routes.ts
│   │   │   ├── addon.routes.ts
│   │   │   └── index.ts             # Route aggregator
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts
│   │   │   ├── validation.middleware.ts
│   │   │   ├── upload.middleware.ts
│   │   │   ├── errorHandler.middleware.ts
│   │   │   └── rateLimiter.middleware.ts
│   │   │
│   │   ├── services/
│   │   │   ├── booking.service.ts
│   │   │   ├── email.service.ts
│   │   │   ├── storage.service.ts
│   │   │   ├── auth.service.ts
│   │   │   └── price.service.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── jwt.utils.ts
│   │   │   ├── password.utils.ts
│   │   │   ├── validation.utils.ts
│   │   │   └── response.utils.ts
│   │   │
│   │   ├── types/
│   │   │   ├── booking.types.ts
│   │   │   ├── express.types.ts
│   │   │   └── auth.types.ts
│   │   │
│   │   ├── config/
│   │   │   ├── database.config.ts
│   │   │   ├── email.config.ts
│   │   │   ├── storage.config.ts
│   │   │   └── cors.config.ts
│   │   │
│   │   ├── templates/               # Email templates
│   │   │   ├── submission.template.ts
│   │   │   ├── confirmation.template.ts
│   │   │   └── rejection.template.ts
│   │   │
│   │   ├── app.ts                   # Express app setup
│   │   └── server.ts                # Server entry point
│   │
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.ts
│   │
│   ├── uploads/                     # Temporary file storage (if not using S3)
│   │
│   ├── .env
│   ├── .env.example
│   ├── tsconfig.json
│   └── package.json
│
└── README.md
```

---

## Database Schema

### Users Table (Admin accounts)
```sql
id                UUID PRIMARY KEY
email             VARCHAR(255) UNIQUE NOT NULL
password_hash     VARCHAR(255) NOT NULL
full_name         VARCHAR(255) NOT NULL
role              ENUM('admin', 'super_admin') DEFAULT 'admin'
created_at        TIMESTAMP DEFAULT NOW()
updated_at        TIMESTAMP DEFAULT NOW()
```

### Bookings Table
```sql
id                      UUID PRIMARY KEY
booking_reference       VARCHAR(50) UNIQUE NOT NULL
full_name               VARCHAR(255) NOT NULL
email                   VARCHAR(255) NOT NULL
phone                   VARCHAR(50) NOT NULL
passport_number         VARCHAR(50) NOT NULL
passport_expiry         DATE NOT NULL
package_type            ENUM('single_game', 'double_game') NOT NULL
accommodation_type      ENUM('hotel', 'hostel') NOT NULL
number_of_travelers     INTEGER NOT NULL
special_requests        TEXT
payment_account_type    ENUM('local', 'international') NOT NULL
base_package_price      DECIMAL(10,2) NOT NULL
addons_total_price      DECIMAL(10,2) DEFAULT 0
total_amount            DECIMAL(10,2) NOT NULL
payment_proof_url       VARCHAR(500) NOT NULL
booking_status          ENUM('pending', 'confirmed', 'rejected') DEFAULT 'pending'
rejection_reason        TEXT
submitted_at            TIMESTAMP DEFAULT NOW()
confirmed_at            TIMESTAMP
confirmed_by            UUID REFERENCES users(id)
updated_at              TIMESTAMP DEFAULT NOW()
```

### AddOns Table
```sql
id                UUID PRIMARY KEY
name              VARCHAR(255) NOT NULL
description       TEXT NOT NULL
price             DECIMAL(10,2) NOT NULL
category          ENUM('merch', 'transport', 'experience', 'food') NOT NULL
is_active         BOOLEAN DEFAULT true
display_order     INTEGER NOT NULL
created_at        TIMESTAMP DEFAULT NOW()
updated_at        TIMESTAMP DEFAULT NOW()
```

### BookingAddOns Table (Many-to-Many Junction)
```sql
id                UUID PRIMARY KEY
booking_id        UUID REFERENCES bookings(id) ON DELETE CASCADE
addon_id          UUID REFERENCES addons(id) ON DELETE CASCADE
quantity          INTEGER DEFAULT 1
price_at_booking  DECIMAL(10,2) NOT NULL
created_at        TIMESTAMP DEFAULT NOW()

UNIQUE(booking_id, addon_id)
```

---

## API Endpoints (Express.js Backend)

### Base URL
- **Development:** `http://localhost:5000/api`
- **Production:** `https://your-backend.railway.app/api`

### Public Endpoints (Customer)

#### GET /api/packages
**File:** `backend/src/controllers/booking.controller.ts`

Returns available packages with pricing
```typescript
// backend/src/routes/booking.routes.ts
import express from 'express';
import { getPackages } from '../controllers/booking.controller';

const router = express.Router();
router.get('/packages', getPackages);

// backend/src/controllers/booking.controller.ts
import { Request, Response } from 'express';

export const getPackages = async (req: Request, res: Response) => {
  const packages = [
    {
      id: "single_game",
      name: "Single Game Package",
      date: "2026-06-27",
      game: "Ghana vs. Croatia",
      duration: "4 nights (June 25-29)",
      pricing: {
        hotel: 1800,
        hostel: 1000
      }
    },
    {
      id: "double_game",
      name: "Double Game Package",
      dates: ["2026-06-23", "2026-06-27"],
      games: ["Ghana vs. England", "Ghana vs. Croatia"],
      duration: "7 nights (June 22-29)",
      pricing: {
        hotel: 3000,
        hostel: 1500
      }
    }
  ];
  
  res.json({ packages });
};
```

**Frontend (TanStack Query):**
```typescript
// frontend/src/hooks/queries/usePackages.ts
import { useQuery } from '@tanstack/react-query';
import { getPackages } from '@/services/packageService';

export const usePackages = () => {
  return useQuery({
    queryKey: ['packages'],
    queryFn: getPackages,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// frontend/src/services/packageService.ts
import axios from '@/lib/axios';

export const getPackages = async () => {
  const { data } = await axios.get('/packages');
  return data.packages;
};
```

#### GET /api/addons
**File:** `backend/src/controllers/addon.controller.ts`

Returns available add-ons
```typescript
// backend/src/controllers/addon.controller.ts
import { Request, Response } from 'express';
import { prisma } from '../config/database.config';

export const getAddons = async (req: Request, res: Response) => {
  try {
    const addons = await prisma.addOn.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' }
    });
    
    res.json({ addons });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch add-ons' });
  }
};
```

**Frontend (TanStack Query):**
```typescript
// frontend/src/hooks/queries/useAddons.ts
import { useQuery } from '@tanstack/react-query';
import { getAddons } from '@/services/addonService';

export const useAddons = () => {
  return useQuery({
    queryKey: ['addons'],
    queryFn: getAddons,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

// frontend/src/services/addonService.ts
import axios from '@/lib/axios';

export const getAddons = async () => {
  const { data } = await axios.get('/addons');
  return data.addons;
};
```

#### POST /api/bookings
Create new booking
```typescript
// backend/src/controllers/booking.controller.ts
import { Request, Response } from 'express';
import { createBookingService } from '../services/booking.service';
import { sendSubmissionEmail } from '../services/email.service';
import { bookingSchema } from '../utils/validation.utils';

export const createBooking = async (req: Request, res: Response) => {
  try {
    const validatedData = bookingSchema.parse(req.body);
    
    const booking = await createBookingService(validatedData);
    await sendSubmissionEmail(booking);
    
    res.status(201).json({
      success: true,
      bookingReference: booking.bookingReference,
      message: "Booking submitted successfully"
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};
```

**Frontend (TanStack Query Mutation):**
```typescript
// frontend/src/hooks/mutations/useCreateBooking.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBooking } from '@/services/bookingService';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';

export const useCreateBooking = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBooking,
    onSuccess: (data) => {
      toast({
        title: "Success!",
        description: `Booking ${data.bookingReference} submitted successfully`,
      });
      router.push(`/success?ref=${data.bookingReference}`);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to submit booking",
        variant: "destructive",
      });
    },
  });
};

// frontend/src/services/bookingService.ts
import axios from '@/lib/axios';
import { BookingFormData } from '@/types/booking';

export const createBooking = async (data: BookingFormData) => {
  const { data: response } = await axios.post('/bookings', data);
  return response;
};
```

#### POST /api/upload
Upload payment proof
```typescript
// backend/src/routes/booking.routes.ts
import { upload } from '../middleware/upload.middleware';
import { uploadFile } from '../controllers/booking.controller';

router.post('/upload', upload.single('file'), uploadFile);

// backend/src/controllers/booking.controller.ts
export const uploadFile = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }
    
    const url = await uploadToS3(req.file);
    
    res.json({ url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

**Frontend (TanStack Query Mutation):**
```typescript
// frontend/src/hooks/mutations/useUploadFile.ts
import { useMutation } from '@tanstack/react-query';
import { uploadFile } from '@/services/bookingService';

export const useUploadFile = () => {
  return useMutation({
    mutationFn: uploadFile,
    onError: (error: any) => {
      toast({
        title: "Upload Failed",
        description: error.response?.data?.error || "Failed to upload file",
        variant: "destructive",
      });
    },
  });
};

// frontend/src/services/bookingService.ts
export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const { data } = await axios.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return data.url;
};
```

### Admin Endpoints (Protected)

#### POST /api/admin/auth/login
Admin login
```typescript
// backend/src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import { signJWT, verifyPassword } from '../utils/jwt.utils';
import { prisma } from '../config/database.config';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = signJWT({
      userId: user.id,
      email: user.email,
      role: user.role
    });
    
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

**Frontend (TanStack Query Mutation):**
```typescript
// frontend/src/hooks/mutations/useLogin.ts
import { useMutation } from '@tanstack/react-query';
import { login } from '@/services/authService';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export const useLogin = () => {
  const router = useRouter();
  const { setUser, setToken } = useAuth();

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setToken(data.token);
      setUser(data.user);
      router.push('/admin/dashboard');
    },
    onError: (error: any) => {
      toast({
        title: "Login Failed",
        description: error.response?.data?.error || "Invalid credentials",
        variant: "destructive",
      });
    },
  });
};

// frontend/src/services/authService.ts
import axios from '@/lib/axios';

export const login = async (credentials: { email: string; password: string }) => {
  const { data } = await axios.post('/admin/auth/login', credentials);
  return data;
};
```

#### GET /api/admin/bookings
Get all bookings with filters
```typescript
// backend/src/controllers/admin.controller.ts
import { Request, Response } from 'express';
import { prisma } from '../config/database.config';

export const getBookings = async (req: Request, res: Response) => {
  try {
    const { status, search, page = '1', limit = '10' } = req.query;
    
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    
    const where: any = {};
    
    if (status) {
      where.bookingStatus = status;
    }
    
    if (search) {
      where.OR = [
        { bookingReference: { contains: search as string, mode: 'insensitive' } },
        { fullName: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } }
      ];
    }
    
    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          bookingAddOns: {
            include: {
              addOn: true
            }
          }
        },
        orderBy: { submittedAt: 'desc' },
        skip: (pageNum - 1) * limitNum,
        take: limitNum
      }),
      prisma.booking.count({ where })
    ]);
    
    res.json({
      bookings,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

**Frontend (TanStack Query):**
```typescript
// frontend/src/hooks/queries/useBookings.ts
import { useQuery } from '@tanstack/react-query';
import { getBookings } from '@/services/adminService';

interface UseBookingsParams {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const useBookings = (params: UseBookingsParams) => {
  return useQuery({
    queryKey: ['bookings', params],
    queryFn: () => getBookings(params),
    keepPreviousData: true, // Keep previous data while fetching new page
  });
};

// frontend/src/services/adminService.ts
import axios from '@/lib/axios';

export const getBookings = async (params: any) => {
  const { data } = await axios.get('/admin/bookings', { params });
  return data;
};
```

#### GET /api/admin/bookings/:id
Get single booking details
```typescript
// backend/src/controllers/admin.controller.ts
export const getBookingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        bookingAddOns: {
          include: {
            addOn: true
          }
        }
      }
    });
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    res.json({ booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

**Frontend (TanStack Query):**
```typescript
// frontend/src/hooks/queries/useBookingDetail.ts
import { useQuery } from '@tanstack/react-query';
import { getBookingById } from '@/services/adminService';

export const useBookingDetail = (id: string) => {
  return useQuery({
    queryKey: ['booking', id],
    queryFn: () => getBookingById(id),
    enabled: !!id, // Only run query if id exists
  });
};

// frontend/src/services/adminService.ts
export const getBookingById = async (id: string) => {
  const { data } = await axios.get(`/admin/bookings/${id}`);
  return data.booking;
};
```

#### PATCH /api/admin/bookings/:id/confirm
Confirm a booking
```typescript
// backend/src/controllers/admin.controller.ts
export const confirmBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { flightDetails } = req.body;
    const userId = req.user.userId; // From auth middleware
    
    const booking = await confirmBookingService(id, userId, flightDetails);
    await sendConfirmationEmail(booking);
    
    res.json({
      success: true,
      message: 'Booking confirmed successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

**Frontend (TanStack Query Mutation):**
```typescript
// frontend/src/hooks/mutations/useConfirmBooking.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { confirmBooking } from '@/services/adminService';

export const useConfirmBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, flightDetails }: { id: string; flightDetails?: string }) =>
      confirmBooking(id, flightDetails),
    onSuccess: (_, variables) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['booking', variables.id] });
      
      toast({
        title: "Success",
        description: "Booking confirmed successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to confirm booking",
        variant: "destructive",
      });
    },
  });
};

// frontend/src/services/adminService.ts
export const confirmBooking = async (id: string, flightDetails?: string) => {
  const { data } = await axios.patch(`/admin/bookings/${id}/confirm`, {
    flightDetails,
  });
  return data;
};
```

#### PATCH /api/admin/bookings/:id/reject
Reject a booking
```typescript
// backend/src/controllers/admin.controller.ts
export const rejectBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;
    
    if (!rejectionReason) {
      return res.status(400).json({ error: 'Rejection reason is required' });
    }
    
    const booking = await rejectBookingService(id, rejectionReason);
    await sendRejectionEmail(booking);
    
    res.json({
      success: true,
      message: 'Booking rejected successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

**Frontend (TanStack Query Mutation):**
```typescript
// frontend/src/hooks/mutations/useRejectBooking.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { rejectBooking } from '@/services/adminService';

export const useRejectBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, rejectionReason }: { id: string; rejectionReason: string }) =>
      rejectBooking(id, rejectionReason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['booking', variables.id] });
      
      toast({
        title: "Success",
        description: "Booking rejected successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to reject booking",
        variant: "destructive",
      });
    },
  });
};

// frontend/src/services/adminService.ts
export const rejectBooking = async (id: string, rejectionReason: string) => {
  const { data } = await axios.patch(`/admin/bookings/${id}/reject`, {
    rejectionReason,
  });
  return data;
};
```

---

## Key Implementation Details

### 1. Dynamic Price Calculation
```typescript
// Client-side
const calculateTotalPrice = (
  packageType: string,
  accommodationType: string,
  selectedAddons: AddOn[]
): number => {
  const basePrice = PACKAGE_PRICES[packageType][accommodationType];
  const addonsTotal = selectedAddons.reduce((sum, addon) => sum + addon.price, 0);
  return basePrice + addonsTotal;
};
```

### 2. File Upload
- Use `multer` on backend for handling file uploads
- Store files in AWS S3 or Cloudinary
- Generate pre-signed URLs for viewing in admin dashboard
- Validate file types (JPG, PNG, PDF only)
- Limit file size to 10MB

### 3. Email Templates
Create HTML email templates with:
- Responsive design
- Brand colors
- Dynamic content insertion
- Clear call-to-action buttons

### 4. Authentication (Express Middleware)
- Use JWT tokens with 24-hour expiration
- Store tokens in localStorage on frontend
- Implement middleware for protecting admin routes
- Hash passwords with bcrypt (10+ rounds)

**Backend Auth Middleware:**
```typescript
// backend/src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    req.user = decoded;
    
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Usage in routes
router.get('/admin/bookings', authMiddleware, getBookings);
```

**Frontend Auth Check (Next.js Middleware):**
```typescript
// frontend/src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Protect admin routes
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = request.cookies.get('token')?.value || 
                  // Check localStorage via client-side redirect
                  null;
    
    // Since we can't access localStorage in middleware,
    // we handle auth check in the admin layout component
    return NextResponse.next();
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};
```

### 5. Form Validation
Frontend:
- React Hook Form with Zod schema
- Real-time validation feedback
- Custom error messages

Backend:
- Express Validator or Zod
- Sanitize inputs
- Validate file uploads

### 6. Status Management
Booking states:
- `pending` → Initial state after submission
- `confirmed` → Admin verified payment and booked tickets
- `rejected` → Payment verification failed

### 7. Email Service (Backend)
```typescript
// backend/src/services/email.service.ts
import nodemailer from 'nodemailer';
import { Booking } from '@prisma/client';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendSubmissionEmail(booking: Booking) {
  const html = `
    <h1>Your World Cup Experience Booking Has Been Received</h1>
    <p>Dear ${booking.fullName},</p>
    <p>Your booking reference: <strong>${booking.bookingReference}</strong></p>
    <p>We are currently reviewing your payment and will send you a confirmation shortly.</p>
  `;

  await transporter.sendMail({
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: booking.email,
    subject: `Your World Cup Experience Booking Has Been Received - ${booking.bookingReference}`,
    html,
  });
}

export async function sendConfirmationEmail(booking: Booking) {
  const html = `
    <h1>Your World Cup Experience is Confirmed!</h1>
    <p>Dear ${booking.fullName},</p>
    <p>Your booking reference: <strong>${booking.bookingReference}</strong></p>
    <p>Your booking has been confirmed and tickets have been booked.</p>
  `;

  await transporter.sendMail({
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: booking.email,
    subject: `Your World Cup Experience is Confirmed! - ${booking.bookingReference}`,
    html,
  });
}

export async function sendRejectionEmail(booking: Booking) {
  const html = `
    <h1>Update on Your World Cup Experience Booking</h1>
    <p>Dear ${booking.fullName},</p>
    <p>Your booking reference: <strong>${booking.bookingReference}</strong></p>
    <p>Unfortunately, we were unable to process your booking:</p>
    <p><em>${booking.rejectionReason}</em></p>
    <p>Please contact our support team for assistance.</p>
  `;

  await transporter.sendMail({
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: booking.email,
    subject: `Update on Your World Cup Experience Booking - ${booking.bookingReference}`,
    html,
  });
}
```

**Note:** For production, consider using email template libraries like:
- `mjml` for responsive email templates
- `handlebars` for template rendering
- Or use a service like Resend with React Email templates

---

## Security Requirements

1. **Input Validation**
   - Sanitize all user inputs
   - Validate email formats
   - Check passport number format
   - Validate dates (passport expiry must be future date)

2. **File Upload Security**
   - Check file MIME types
   - Scan for malware (optional: ClamAV)
   - Generate unique filenames
   - Store in secure cloud storage

3. **Authentication**
   - Hash passwords with bcrypt (10+ rounds)
   - Use JWT with short expiration
   - Implement rate limiting on login
   - CSRF protection

4. **Data Protection**
   - Encrypt sensitive data at rest
   - Use HTTPS for all communications
   - Implement CORS properly
   - Don't expose sensitive info in error messages

5. **Admin Access**
   - Role-based permissions
   - Audit logs for admin actions
   - Session timeout
   - Two-factor authentication (future enhancement)

---

## Environment Variables

### Frontend (.env.local)
```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=World Cup Experience
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Payment Account Details (Local)
NEXT_PUBLIC_LOCAL_BANK_NAME=Ghana Commercial Bank
NEXT_PUBLIC_LOCAL_ACCOUNT_NUMBER=1234567890
NEXT_PUBLIC_LOCAL_ACCOUNT_NAME=Altair Logistics Ltd
NEXT_PUBLIC_LOCAL_BANK_BRANCH=Accra Main Branch

# Payment Account Details (International)
NEXT_PUBLIC_INTL_BANK_NAME=Standard Chartered Bank
NEXT_PUBLIC_INTL_SWIFT_CODE=SCBLGHAC
NEXT_PUBLIC_INTL_ACCOUNT_NUMBER=9876543210
NEXT_PUBLIC_INTL_ACCOUNT_NAME=Altair Logistics Ltd
NEXT_PUBLIC_INTL_IBAN=GH12SCBL00001234567890
```

### Backend (.env)
```bash
# Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/worldcup_booking

# JWT Authentication
JWT_SECRET=your_jwt_secret_here_minimum_32_characters_long
JWT_EXPIRES_IN=24h

# Email Service - Option 1: Nodemailer with SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
FROM_EMAIL=noreply@altairlogistics.com
FROM_NAME=Altair Logistics

# Email Service - Option 2: Resend
# RESEND_API_KEY=re_xxxxxxxxxxxxx

# Email Service - Option 3: SendGrid
# SENDGRID_API_KEY=SG.xxxxxxxxxxxxx

# File Storage - Option 1: AWS S3
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=worldcup-bookings
AWS_S3_BUCKET_URL=https://worldcup-bookings.s3.amazonaws.com

# File Storage - Option 2: Cloudinary
# CLOUDINARY_CLOUD_NAME=your_cloud_name
# CLOUDINARY_API_KEY=your_api_key
# CLOUDINARY_API_SECRET=your_api_secret

# CORS
CORS_ORIGIN=http://localhost:3000

# Admin (for seeding)
ADMIN_EMAIL=admin@altairlogistics.com
ADMIN_PASSWORD=change_this_in_production
ADMIN_NAME=Admin User
```

### Frontend (.env.example)
```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=World Cup Experience
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Payment Account Details (Local)
NEXT_PUBLIC_LOCAL_BANK_NAME=
NEXT_PUBLIC_LOCAL_ACCOUNT_NUMBER=
NEXT_PUBLIC_LOCAL_ACCOUNT_NAME=
NEXT_PUBLIC_LOCAL_BANK_BRANCH=

# Payment Account Details (International)
NEXT_PUBLIC_INTL_BANK_NAME=
NEXT_PUBLIC_INTL_SWIFT_CODE=
NEXT_PUBLIC_INTL_ACCOUNT_NUMBER=
NEXT_PUBLIC_INTL_ACCOUNT_NAME=
NEXT_PUBLIC_INTL_IBAN=
```

### Backend (.env.example)
```bash
# Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/worldcup_booking

# JWT
JWT_SECRET=
JWT_EXPIRES_IN=24h

# Email (choose one provider)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
FROM_EMAIL=
FROM_NAME=

# File Storage (choose one provider)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_S3_BUCKET=
AWS_S3_BUCKET_URL=

# CORS
CORS_ORIGIN=http://localhost:3000

# Admin
ADMIN_EMAIL=
ADMIN_PASSWORD=
ADMIN_NAME=
```

---

## Development Workflow

### Initial Setup

#### Backend Setup
```bash
# 1. Create backend directory and initialize
mkdir backend
cd backend
npm init -y

# 2. Install dependencies
npm install express cors helmet express-rate-limit
npm install @prisma/client bcryptjs jsonwebtoken
npm install multer aws-sdk # or cloudinary
npm install nodemailer # or resend
npm install dotenv zod

# Install dev dependencies
npm install -D typescript @types/node @types/express
npm install -D @types/cors @types/bcryptjs @types/jsonwebtoken
npm install -D @types/multer @types/nodemailer
npm install -D ts-node-dev prisma
npm install -D @types/express-rate-limit

# 3. Initialize TypeScript
npx tsc --init

# 4. Initialize Prisma
npx prisma init

# 5. Set up PostgreSQL database
# - Install PostgreSQL locally or use hosted service
# - Update DATABASE_URL in .env

# 6. Create Prisma schema (see Database Schema section)

# 7. Run migrations
npx prisma migrate dev --name init

# 8. Seed database
npx prisma db seed

# 9. Generate Prisma Client
npx prisma generate

# 10. Configure environment variables
cp .env.example .env
# Fill in your actual values

# 11. Update package.json scripts
# Add these scripts:
{
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio",
    "prisma:seed": "ts-node prisma/seed.ts"
  }
}

# 12. Start backend server
npm run dev
# Server runs on http://localhost:5000
```

#### Frontend Setup
```bash
# 1. Create Next.js project
npx create-next-app@latest frontend --typescript --tailwind --app

cd frontend

# 2. Install dependencies
npm install @tanstack/react-query
npm install axios
npm install react-hook-form @hookform/resolvers zod
npm install date-fns # for date formatting
npm install react-dropzone # for file uploads

# Install UI library (optional)
npx shadcn-ui@latest init
npx shadcn-ui@latest add button input select card dialog toast

# 3. Create project structure
mkdir -p src/components/ui
mkdir -p src/components/customer
mkdir -p src/components/admin
mkdir -p src/components/common
mkdir -p src/lib
mkdir -p src/hooks/queries
mkdir -p src/hooks/mutations
mkdir -p src/services
mkdir -p src/types
mkdir -p src/constants
mkdir -p src/context
mkdir -p src/providers

# 4. Configure environment variables
cp .env.example .env.local
# Fill in your actual values

# 5. Start frontend server
npm run dev
# App runs on http://localhost:3000
```

### Key Configuration Files

#### Backend - tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

#### Backend - prisma/schema.prisma
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// See Database Schema section for full schema
```

#### Backend - src/app.ts
```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler.middleware';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Error handling
app.use(errorHandler);

export default app;
```

#### Backend - src/server.ts
```typescript
import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});
```

#### Frontend - src/lib/axios.ts
```typescript
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      localStorage.removeItem('token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
```

#### Frontend - src/lib/queryClient.ts
```typescript
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});
```

#### Frontend - src/providers/QueryProvider.tsx
```typescript
'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '@/lib/queryClient';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

#### Frontend - src/app/layout.tsx
```typescript
import { QueryProvider } from '@/providers/QueryProvider';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          {children}
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
```

### Database Management
```bash
# Navigate to backend directory
cd backend

# Create a new migration
npx prisma migrate dev --name description_of_changes

# Reset database (development only)
npx prisma migrate reset

# Open Prisma Studio (database GUI)
npx prisma studio

# Generate Prisma Client (after schema changes)
npx prisma generate

# Seed database
npm run prisma:seed
```

### Development Commands

#### Backend
```bash
cd backend

# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Database commands
npm run prisma:generate
npm run prisma:migrate
npm run prisma:studio
npm run prisma:seed
```

#### Frontend
```bash
cd frontend

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

### Running Both Servers Concurrently

You can use `concurrently` to run both servers at once:

```bash
# In root directory
npm install -D concurrently

# Add to root package.json
{
  "scripts": {
    "dev": "concurrently \"npm run dev --prefix backend\" \"npm run dev --prefix frontend\"",
    "dev:backend": "npm run dev --prefix backend",
    "dev:frontend": "npm run dev --prefix frontend"
  }
}

# Run both servers
npm run dev
```

### Deployment

#### Backend Deployment (Railway/Render)

**Railway:**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Add PostgreSQL
railway add --database postgresql

# Deploy
railway up

# Set environment variables in Railway dashboard
```

**Render:**
1. Connect GitHub repository
2. Create new Web Service
3. Build Command: `npm install && npm run build`
4. Start Command: `npm start`
5. Add PostgreSQL database
6. Set environment variables

#### Frontend Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd frontend
vercel

# Set environment variables
vercel env add NEXT_PUBLIC_API_URL
# Enter production backend URL

# Deploy to production
vercel --prod
```

### Post-Deployment Checklist
- [ ] Backend deployed and accessible
- [ ] Database created and migrated
- [ ] Database seeded with add-ons and admin user
- [ ] All backend environment variables configured
- [ ] Frontend deployed
- [ ] Frontend NEXT_PUBLIC_API_URL points to backend
- [ ] CORS configured correctly on backend
- [ ] Email sending works (test all three types)
- [ ] File upload works (test payment proof)
- [ ] Admin can login
- [ ] Customer can submit booking
- [ ] SSL/HTTPS active on both frontend and backend
- [ ] Test on mobile devices

---

## Future Enhancements (Out of Scope for MVP)

- Payment gateway integration (Stripe/Paystack)
- Customer portal to track booking status
- Multi-currency support
- Mobile app
- SMS notifications
- Group booking discounts
- Refund processing
- Travel insurance integration
- Analytics dashboard

---

## Success Criteria

- [ ] Customer can view packages and add-ons
- [ ] Customer can fill and submit booking form
- [ ] File upload works for payment proof
- [ ] Dynamic price calculation is accurate
- [ ] Submission email is sent automatically
- [ ] Admin can login to dashboard
- [ ] Admin can view all bookings with filters
- [ ] Admin can view payment proof
- [ ] Admin can confirm bookings
- [ ] Admin can reject bookings with custom message
- [ ] Confirmation/rejection emails are sent
- [ ] All forms have proper validation
- [ ] Application is responsive on mobile
- [ ] Application is secure (no vulnerabilities)
- [ ] Page load times < 3 seconds

---

**Start Date:** TBD  
**Target Completion:** 13 weeks from start  
**Team Size:** TBD  
**Priority:** High
