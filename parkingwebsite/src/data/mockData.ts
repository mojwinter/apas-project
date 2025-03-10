import type { ParkingLocation, ParkingSpot, ParkingSession, RevenueData, OccupancyData, User } from "../types"
import { addHours, subDays, format, subHours } from "date-fns"

// Mock parking locations
export const parkingLocations: ParkingLocation[] = [
  {
    id: "loc1",
    name: "Downtown Parking",
    address: "123 Main St, Kingston",
    totalSpots: 50,
    availableSpots: 12,
    pricePerHour: 2.5,
    rating: 4.8,
    distance: "0.3 km",
    image:
        "https://images.unsplash.com/photo-1470224114660-3f6686c562eb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80",
  },
  {
    id: "loc2",
    name: "Waterfront Garage",
    address: "456 Harbor Dr, Kingston",
    totalSpots: 75,
    availableSpots: 5,
    pricePerHour: 3.0,
    rating: 4.5,
    distance: "0.7 km",
    image:
        "https://images.unsplash.com/photo-1545179605-1296651e9d43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80",
  },
  {
    id: "loc3",
    name: "City Center",
    address: "789 Center Ave, Kingston",
    totalSpots: 30,
    availableSpots: 8,
    pricePerHour: 2.75,
    rating: 4.3,
    image:
        "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80",
  },
  {
    id: "loc4",
    name: "University Parking",
    address: "101 College Rd, Kingston",
    totalSpots: 10,
    availableSpots: 5,
    pricePerHour: 1.5,
    rating: 4.0,
    image:
        "https://images.unsplash.com/photo-1590674899484-d5640e854abe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80",
  },
]

// Find the University Parking location and update its totalSpots to 10
const universityParkingIndex = parkingLocations.findIndex((loc) => loc.name === "University Parking")
if (universityParkingIndex !== -1) {
  parkingLocations[universityParkingIndex].totalSpots = 10
  parkingLocations[universityParkingIndex].availableSpots = 5 // Half of them available
}

// Generate mock parking spots
const generateParkingSpots = (): ParkingSpot[] => {
  const spots: ParkingSpot[] = []
  const zones = ["A", "B", "C", "D"]

  parkingLocations.forEach((location) => {
    const locationZone = zones[Math.floor(Math.random() * zones.length)]

    // Special handling for University Parking
    if (location.name === "University Parking") {
      // Create exactly 10 spots for University Parking
      for (let i = 0; i < 10; i++) {
        const spotNumber = i.toString()
        const zone = `${locationZone}-${spotNumber}`

        // Determine status: 50% available, 30% occupied, 20% expired
        let status: "available" | "occupied" | "expired"
        const rand = Math.random()
        if (rand < 0.5) {
          status = "available"
        } else if (rand < 0.8) {
          status = "occupied"
        } else {
          status = "expired"
        }

        const now = new Date()
        let occupiedSince, occupiedUntil

        if (status === "occupied") {
          occupiedSince = subHours(now, Math.floor(Math.random() * 5) + 1).toISOString()
          occupiedUntil = addHours(now, Math.floor(Math.random() * 5) + 1).toISOString()
        } else if (status === "expired") {
          occupiedSince = subHours(now, Math.floor(Math.random() * 10) + 5).toISOString()
          occupiedUntil = subHours(now, Math.floor(Math.random() * 4) + 1).toISOString() // In the past
        }

        spots.push({
          id: `spot-${location.id}-${i}`,
          locationId: location.id,
          spotNumber: spotNumber,
          zone: zone,
          status: status,
          occupiedSince,
          occupiedUntil,
          userId: status === "occupied" || status === "expired" ? `user-${Math.floor(Math.random() * 100)}` : undefined,
          userName:
              status === "occupied" || status === "expired" ? `User ${Math.floor(Math.random() * 100)}` : undefined,
          userVehicle:
              status === "occupied" || status === "expired" ? `Vehicle ${Math.floor(Math.random() * 100)}` : undefined,
          price: location.pricePerHour,
          isAccessible: i % 10 === 0,
        })
      }
    } else {
      // Original logic for other locations but with new status types
      for (let i = 1; i <= location.totalSpots; i++) {
        const spotNumber = i.toString().padStart(2, "0")
        const zone = `${locationZone}-${spotNumber}`

        // Determine status based on available spots
        let status: "available" | "occupied" | "expired"
        if (i <= location.totalSpots - location.availableSpots) {
          // This would normally be occupied, but let's make some expired
          status = Math.random() > 0.3 ? "occupied" : "expired"
        } else {
          status = "available"
        }

        const now = new Date()
        let occupiedSince, occupiedUntil

        if (status === "occupied") {
          occupiedSince = subHours(now, Math.floor(Math.random() * 5) + 1).toISOString()
          occupiedUntil = addHours(now, Math.floor(Math.random() * 5) + 1).toISOString()
        } else if (status === "expired") {
          occupiedSince = subHours(now, Math.floor(Math.random() * 10) + 5).toISOString()
          occupiedUntil = subHours(now, Math.floor(Math.random() * 4) + 1).toISOString() // In the past
        }

        spots.push({
          id: `spot-${location.id}-${i}`,
          locationId: location.id,
          spotNumber: spotNumber,
          zone: zone,
          status: status,
          occupiedSince,
          occupiedUntil,
          userId: status === "occupied" || status === "expired" ? `user-${Math.floor(Math.random() * 100)}` : undefined,
          userName:
              status === "occupied" || status === "expired" ? `User ${Math.floor(Math.random() * 100)}` : undefined,
          userVehicle:
              status === "occupied" || status === "expired" ? `Vehicle ${Math.floor(Math.random() * 100)}` : undefined,
          price: location.pricePerHour,
          isAccessible: i % 10 === 0,
        })
      }
    }
  })

  return spots
}

export const parkingSpots: ParkingSpot[] = generateParkingSpots()

// Generate mock parking sessions
const generateParkingSessions = (): ParkingSession[] => {
  const sessions: ParkingSession[] = []
  const statuses: ("active" | "completed" | "cancelled")[] = ["active", "completed", "cancelled"]
  const paymentStatuses: ("paid" | "pending" | "failed")[] = ["paid", "pending", "failed"]
  const paymentMethods = ["Credit Card", "Debit Card", "PayPal", "Apple Pay", "Google Pay"]

  for (let i = 1; i <= 50; i++) {
    const locationIndex = Math.floor(Math.random() * parkingLocations.length)
    const location = parkingLocations[locationIndex]
    const spotNumber = Math.floor(Math.random() * location.totalSpots) + 1
    const zone = `Zone ${String.fromCharCode(65 + Math.floor(Math.random() * 4))}-${spotNumber.toString().padStart(2, "0")}`

    const now = new Date()
    const startTime = subDays(now, Math.floor(Math.random() * 30)).toISOString()
    const endTime = addHours(new Date(startTime), Math.floor(Math.random() * 5) + 1).toISOString()
    const status = i <= 10 ? "active" : Math.random() > 0.1 ? "completed" : "cancelled"
    const amount = Number.parseFloat(
        ((location.pricePerHour * (new Date(endTime).getTime() - new Date(startTime).getTime())) / 3600000).toFixed(2),
    )

    sessions.push({
      id: `session-${i}`,
      userId: `user-${Math.floor(Math.random() * 100)}`,
      userName: `User ${Math.floor(Math.random() * 100)}`,
      locationId: location.id,
      locationName: location.name,
      spotId: `spot-${location.id}-${spotNumber}`,
      spotNumber: spotNumber.toString(),
      zone: zone,
      startTime,
      endTime,
      status,
      amount,
      paymentStatus: status === "active" ? "pending" : Math.random() > 0.1 ? "paid" : "failed",
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
    })
  }

  return sessions
}

export const parkingSessions: ParkingSession[] = generateParkingSessions()

// Generate mock revenue data
export const generateRevenueData = (): RevenueData[] => {
  const data: RevenueData[] = []
  const now = new Date()

  for (let i = 30; i >= 0; i--) {
    const date = subDays(now, i)
    const amount = Math.floor(Math.random() * 1000) + 500

    data.push({
      date: format(date, "MMM dd"),
      amount,
    })
  }

  return data
}

export const revenueData: RevenueData[] = generateRevenueData()

// Generate mock occupancy data
export const generateOccupancyData = (): OccupancyData[] => {
  const data: OccupancyData[] = []
  const now = new Date()
  now.setMinutes(0)
  now.setSeconds(0)
  now.setMilliseconds(0)

  for (let i = 0; i < 24; i++) {
    const time = addHours(now, i - 23)
    const occupancyRate = Math.min(100, Math.max(20, Math.floor(Math.random() * 60) + 20 + (i % 12 === 0 ? 20 : 0)))

    data.push({
      time: format(time, "HH:mm"),
      occupancyRate,
    })
  }

  return data
}

export const occupancyData: OccupancyData[] = generateOccupancyData()

// Generate mock users
export const generateUsers = (): User[] => {
  const users: User[] = []

  for (let i = 1; i <= 20; i++) {
    const joinDate = subDays(new Date(), Math.floor(Math.random() * 365)).toISOString()
    const lastActive = subDays(new Date(), Math.floor(Math.random() * 30)).toISOString()

    users.push({
      id: `user-${i}`,
      name: `User ${i}`,
      email: `user${i}@example.com`,
      phone: `+1 ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      totalSessions: Math.floor(Math.random() * 50) + 1,
      totalSpent: Number.parseFloat((Math.random() * 500 + 50).toFixed(2)),
      joinDate,
      lastActive,
    })
  }

  return users
}

export const users: User[] = generateUsers()

// Calculate current stats
export const calculateCurrentStats = () => {
  const totalRevenue = parkingSessions.reduce(
      (sum, session) => sum + (session.paymentStatus === "paid" ? session.amount : 0),
      0,
  )
  const activeSessionsCount = parkingSessions.filter((session) => session.status === "active").length
  const occupiedSpotsCount = parkingSpots.filter((spot) => spot.status === "occupied").length
  const totalSpotsCount = parkingSpots.length
  const occupancyRate = Math.round((occupiedSpotsCount / totalSpotsCount) * 100)

  return {
    totalRevenue,
    activeSessionsCount,
    occupiedSpotsCount,
    totalSpotsCount,
    occupancyRate,
  }
}

export const currentStats = calculateCurrentStats()

