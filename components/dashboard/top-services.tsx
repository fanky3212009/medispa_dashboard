const services = [
  {
    name: "SkinTag Removal",
    thisMonth: 14,
    lastMonth: 10
  },
  {
    name: "Signature Facial",
    thisMonth: 13,
    lastMonth: 15
  },
  {
    name: "Revlite laser",
    thisMonth: 9,
    lastMonth: 6
  },
  {
    name: "Consultation",
    thisMonth: 6,
    lastMonth: 5
  },
  {
    name: "SYNA韓國無創氣墊針",
    thisMonth: 5,
    lastMonth: 4
  }
]

export function TopServices() {
  return (
    <div className="space-y-4">
      {services.map((service) => (
        <div key={service.name}>
          <div className="font-semibold">{service.name}</div>
          <div className="text-sm text-muted-foreground">
            {service.thisMonth} This month / {service.lastMonth} Last month
          </div>
        </div>
      ))}
    </div>
  )
} 