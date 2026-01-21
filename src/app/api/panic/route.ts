import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const panicRequestSchema = z.object({
  contacts: z.array(
    z.object({
      name: z.string(),
      phone: z.string(),
    })
  ),
  message: z.string(),
  location: z
    .object({
      latitude: z.number(),
      longitude: z.number(),
    })
    .nullable(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const result = panicRequestSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.issues },
        { status: 400 }
      )
    }

    const { contacts, message, location } = result.data

    if (contacts.length === 0) {
      return NextResponse.json(
        { error: 'No contacts configured' },
        { status: 400 }
      )
    }

    // Build message with location if available
    let fullMessage = message
    if (location) {
      const mapUrl = `https://maps.google.com/?q=${location.latitude},${location.longitude}`
      fullMessage = `${message}\n\nLocation: ${mapUrl}`
    }

    // TODO: Integrate with Twilio for actual SMS sending
    // For each contact, send SMS via Twilio
    // const twilio = require('twilio')(
    //   process.env.TWILIO_ACCOUNT_SID,
    //   process.env.TWILIO_AUTH_TOKEN
    // )
    //
    // const sendPromises = contacts.map((contact) =>
    //   twilio.messages.create({
    //     body: fullMessage,
    //     from: process.env.TWILIO_PHONE_NUMBER,
    //     to: contact.phone,
    //   })
    // )
    //
    // await Promise.all(sendPromises)

    // Log for development (remove in production)
    console.log('Panic alert triggered:')
    console.log('Contacts:', contacts.map((c) => c.name).join(', '))
    console.log('Message:', fullMessage)

    // Return success
    return NextResponse.json({
      success: true,
      message: `Emergency alert sent to ${contacts.length} contact(s)`,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error sending panic alert:', error)
    return NextResponse.json(
      { error: 'Failed to send emergency alert' },
      { status: 500 }
    )
  }
}
