"use client"

import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { createClient } from "@/lib/services/clients"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }),
  dob: z.date({
    required_error: "Date of birth is required.",
  }),
  gender: z.string({
    required_error: "Please select a gender.",
  }),
  occupation: z.string().optional(),
  maritalStatus: z.string().optional(),
  referredBy: z.string().optional(),
  consultant: z.string().optional(),
  notes: z.string().optional(),
  // Patient Intake fields
  skinType: z.string().optional(),
  wrinkleType: z.string().optional(),
  skinTone: z.string().optional(),
  bloodCirculation: z.string().optional(),
  skinThickness: z.string().optional(),
  poreSize: z.string().optional(),
  skinElasticity: z.string().optional(),
  laser: z.boolean().optional(),
  ipl: z.boolean().optional(),
  radiofrequency: z.boolean().optional(),
  electricalCurrent: z.boolean().optional(),
  peel: z.boolean().optional(),
  hydrafacial: z.boolean().optional(),
  aestheticTreatmentDate: z.string().optional(),
  hyaluronicAcid: z.boolean().optional(),
  botulinumToxin: z.boolean().optional(),
  growthFactors: z.boolean().optional(),
  lacticAcid: z.boolean().optional(),
  microInvasiveOther: z.string().optional(),
  microInvasiveDate: z.string().optional(),
  satisfactionLevel: z.string().optional(),
  facelift: z.boolean().optional(),
  prosthesis: z.boolean().optional(),
  doubleEyelid: z.boolean().optional(),
  boneShaving: z.boolean().optional(),
  breastImplants: z.boolean().optional(),
  liposuction: z.boolean().optional(),
  plasticSurgeryOther: z.string().optional(),
  plasticSurgeryDate: z.string().optional(),
  heartDisease: z.boolean().optional(),
  highBloodPressure: z.boolean().optional(),
  diabetes: z.boolean().optional(),
  pacemaker: z.boolean().optional(),
  cancer: z.boolean().optional(),
  cancerName: z.string().optional(),
  cancerDate: z.string().optional(),
  orthodontics: z.boolean().optional(),
  orthodonticsName: z.string().optional(),
  orthodonticsDate: z.string().optional(),
  immuneSystemCondition: z.boolean().optional(),
  immuneSystemDetails: z.string().optional(),
  surgery: z.boolean().optional(),
  surgeryName: z.string().optional(),
  surgeryDate: z.string().optional(),
  currentlyPregnant: z.boolean().optional(),
  sensitiveToLight: z.boolean().optional(),
  lightSensitivityDetails: z.string().optional(),
  substanceAllergies: z.boolean().optional(),
  allergyDetails: z.string().optional(),
  longTermMedication: z.boolean().optional(),
  medicationDetails: z.string().optional(),
  implants: z.boolean().optional(),
  metalStent: z.boolean().optional(),
  threadLifting: z.boolean().optional(),
  hypertrophicScar: z.boolean().optional(),
})

export function NewClientForm() {
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      occupation: "",
      maritalStatus: "",
      referredBy: "",
      consultant: "",
      notes: "",
      // Patient Intake defaults
      skinType: "",
      wrinkleType: "",
      skinTone: "",
      bloodCirculation: "",
      skinThickness: "",
      poreSize: "",
      skinElasticity: "",
      laser: false,
      ipl: false,
      radiofrequency: false,
      electricalCurrent: false,
      peel: false,
      hydrafacial: false,
      aestheticTreatmentDate: "",
      hyaluronicAcid: false,
      botulinumToxin: false,
      growthFactors: false,
      lacticAcid: false,
      microInvasiveOther: "",
      microInvasiveDate: "",
      satisfactionLevel: "",
      facelift: false,
      prosthesis: false,
      doubleEyelid: false,
      boneShaving: false,
      breastImplants: false,
      liposuction: false,
      plasticSurgeryOther: "",
      plasticSurgeryDate: "",
      heartDisease: false,
      highBloodPressure: false,
      diabetes: false,
      pacemaker: false,
      cancer: false,
      cancerName: "",
      cancerDate: "",
      orthodontics: false,
      orthodonticsName: "",
      orthodonticsDate: "",
      immuneSystemCondition: false,
      immuneSystemDetails: "",
      surgery: false,
      surgeryName: "",
      surgeryDate: "",
      currentlyPregnant: false,
      sensitiveToLight: false,
      lightSensitivityDetails: "",
      substanceAllergies: false,
      allergyDetails: "",
      longTermMedication: false,
      medicationDetails: "",
      implants: false,
      metalStent: false,
      threadLifting: false,
      hypertrophicScar: false,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Create client with basic info
      const clientData = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        dob: values.dob,
        gender: values.gender,
        occupation: values.occupation || undefined,
        maritalStatus: values.maritalStatus || undefined,
        referredBy: values.referredBy || undefined,
        consultant: values.consultant || undefined,
        notes: values.notes || undefined
      }

      // Create patient intake data
      const patientIntakeData = {
        skinType: values.skinType || undefined,
        wrinkleType: values.wrinkleType || undefined,
        skinTone: values.skinTone || undefined,
        bloodCirculation: values.bloodCirculation || undefined,
        skinThickness: values.skinThickness || undefined,
        poreSize: values.poreSize || undefined,
        skinElasticity: values.skinElasticity || undefined,
        laser: values.laser || false,
        ipl: values.ipl || false,
        radiofrequency: values.radiofrequency || false,
        electricalCurrent: values.electricalCurrent || false,
        peel: values.peel || false,
        hydrafacial: values.hydrafacial || false,
        aestheticTreatmentDate: values.aestheticTreatmentDate || undefined,
        hyaluronicAcid: values.hyaluronicAcid || false,
        botulinumToxin: values.botulinumToxin || false,
        growthFactors: values.growthFactors || false,
        lacticAcid: values.lacticAcid || false,
        microInvasiveOther: values.microInvasiveOther || undefined,
        microInvasiveDate: values.microInvasiveDate || undefined,
        satisfactionLevel: values.satisfactionLevel || undefined,
        facelift: values.facelift || false,
        prosthesis: values.prosthesis || false,
        doubleEyelid: values.doubleEyelid || false,
        boneShaving: values.boneShaving || false,
        breastImplants: values.breastImplants || false,
        liposuction: values.liposuction || false,
        plasticSurgeryOther: values.plasticSurgeryOther || undefined,
        plasticSurgeryDate: values.plasticSurgeryDate || undefined,
        heartDisease: values.heartDisease || false,
        highBloodPressure: values.highBloodPressure || false,
        diabetes: values.diabetes || false,
        pacemaker: values.pacemaker || false,
        cancer: values.cancer || false,
        cancerName: values.cancerName || undefined,
        cancerDate: values.cancerDate || undefined,
        orthodontics: values.orthodontics || false,
        orthodonticsName: values.orthodonticsName || undefined,
        orthodonticsDate: values.orthodonticsDate || undefined,
        immuneSystemCondition: values.immuneSystemCondition || false,
        immuneSystemDetails: values.immuneSystemDetails || undefined,
        surgery: values.surgery || false,
        surgeryName: values.surgeryName || undefined,
        surgeryDate: values.surgeryDate || undefined,
        currentlyPregnant: values.currentlyPregnant || false,
        sensitiveToLight: values.sensitiveToLight || false,
        lightSensitivityDetails: values.lightSensitivityDetails || undefined,
        substanceAllergies: values.substanceAllergies || false,
        allergyDetails: values.allergyDetails || undefined,
        longTermMedication: values.longTermMedication || false,
        medicationDetails: values.medicationDetails || undefined,
        implants: values.implants || false,
        metalStent: values.metalStent || false,
        threadLifting: values.threadLifting || false,
        hypertrophicScar: values.hypertrophicScar || false,
      }

      const client = await createClient(clientData)

      // Save patient intake if any fields are filled
      const hasPatientIntakeData = Object.values(patientIntakeData).some(value =>
        value !== undefined && value !== false && value !== ""
      )

      if (hasPatientIntakeData) {
        const response = await fetch(`/api/clients/${client.id}/patient-intake`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(patientIntakeData),
        })

        if (!response.ok) {
          console.error('Failed to save patient intake data')
        }
      }

      toast({
        title: "Success",
        description: `${values.name} has been added to your client list.`,
      })
      router.push("/dashboard/clients")
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create client. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of Birth</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="occupation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Occupation</FormLabel>
                    <FormControl>
                      <Input placeholder="Occupation" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maritalStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marital Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select marital status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="single">Single</SelectItem>
                        <SelectItem value="married">Married</SelectItem>
                        <SelectItem value="divorced">Divorced</SelectItem>
                        <SelectItem value="widowed">Widowed</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="referredBy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Referred By</FormLabel>
                    <FormControl>
                      <Input placeholder="How did they hear about us?" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-6">
              <FormField
                control={form.control}
                name="consultant"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Consultant</FormLabel>
                    <FormControl>
                      <Input placeholder="Assigned consultant" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-6">
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add any additional notes about the client..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Patient Intake Card */}
        <Card>
          <CardHeader>
            <CardTitle>Patient Intake Information (Optional)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">

            {/* Skin Condition Section */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Skin Condition</h4>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="skinType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Skin Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select skin type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Dry">Dry</SelectItem>
                          <SelectItem value="Neutral">Neutral</SelectItem>
                          <SelectItem value="Oily">Oily</SelectItem>
                          <SelectItem value="Sensitive">Sensitive</SelectItem>
                          <SelectItem value="Hybrid">Hybrid</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="wrinkleType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Wrinkle Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select wrinkle type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Fine">Fine</SelectItem>
                          <SelectItem value="Normal">Normal</SelectItem>
                          <SelectItem value="Thick">Thick</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="skinTone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Skin Tone</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select skin tone" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Fair">Fair</SelectItem>
                          <SelectItem value="Dark">Dark</SelectItem>
                          <SelectItem value="Average">Average</SelectItem>
                          <SelectItem value="Tan">Tan</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bloodCirculation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blood Circulation</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select circulation" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Poor">Poor</SelectItem>
                          <SelectItem value="Normal">Normal</SelectItem>
                          <SelectItem value="Good">Good</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="skinThickness"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Skin Thickness</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select thickness" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Thin">Thin</SelectItem>
                          <SelectItem value="Normal">Normal</SelectItem>
                          <SelectItem value="Thick">Thick</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="poreSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pore Size</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select pore size" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Small">Small</SelectItem>
                          <SelectItem value="Normal">Normal</SelectItem>
                          <SelectItem value="Large">Large</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="skinElasticity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Skin Elasticity</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select elasticity" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Poor">Poor</SelectItem>
                          <SelectItem value="Normal">Normal</SelectItem>
                          <SelectItem value="Good">Good</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Previous Aesthetic Treatments */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Previous Aesthetic Treatments Received</h4>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { key: 'laser', label: 'Laser' },
                  { key: 'ipl', label: 'IPL (Intense Pulsed Light)' },
                  { key: 'radiofrequency', label: 'Radiofrequency' },
                  { key: 'electricalCurrent', label: 'Electrical Current' },
                  { key: 'peel', label: 'Peel' },
                  { key: 'hydrafacial', label: 'Hydrafacial' }
                ].map(({ key, label }) => (
                  <FormField
                    key={key}
                    control={form.control}
                    name={key as any}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>{label}</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              <FormField
                control={form.control}
                name="aestheticTreatmentDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Treatment Date</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Previous Micro-Invasive Treatments */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Previous Micro-Invasive Treatments Received (Treatment Area)</h4>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { key: 'hyaluronicAcid', label: 'Hyaluronic Acid' },
                  { key: 'botulinumToxin', label: 'Botulinum toxin' },
                  { key: 'growthFactors', label: 'Growth Factors' },
                  { key: 'lacticAcid', label: 'Lactic Acid' }
                ].map(({ key, label }) => (
                  <FormField
                    key={key}
                    control={form.control}
                    name={key as any}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>{label}</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="microInvasiveOther"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Other</FormLabel>
                      <FormControl>
                        <Input placeholder="Specify other treatment" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="microInvasiveDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Treatment Date</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="satisfactionLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Satisfaction Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select satisfaction level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Moderate">Moderate</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Previous Plastic Surgery Treatments */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Previous Plastic Surgery Treatments (Treatment Area)</h4>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { key: 'facelift', label: 'Facelift' },
                  { key: 'prosthesis', label: 'Prosthesis' },
                  { key: 'doubleEyelid', label: 'Double eye-lid' },
                  { key: 'boneShaving', label: 'Bone shaving' },
                  { key: 'breastImplants', label: 'Breast Implants' },
                  { key: 'liposuction', label: 'Liposuction' }
                ].map(({ key, label }) => (
                  <FormField
                    key={key}
                    control={form.control}
                    name={key as any}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>{label}</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="plasticSurgeryOther"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Other</FormLabel>
                      <FormControl>
                        <Input placeholder="Specify other treatment" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="plasticSurgeryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Treatment Date</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Health Conditions */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Health Conditions</h4>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { key: 'heartDisease', label: 'Heart disease' },
                  { key: 'highBloodPressure', label: 'High blood pressure' },
                  { key: 'diabetes', label: 'Diabetes' },
                  { key: 'pacemaker', label: 'Pacemaker' },
                  { key: 'cancer', label: 'Cancer (Within 5 years)' },
                  { key: 'orthodontics', label: 'Orthodontics' },
                  { key: 'immuneSystemCondition', label: 'Immune System & Skin condition' },
                  { key: 'surgery', label: 'Surgery' },
                  { key: 'currentlyPregnant', label: 'Currently Pregnant' },
                  { key: 'sensitiveToLight', label: 'Sensitive to light' },
                  { key: 'substanceAllergies', label: 'Substance or medication allergies' },
                  { key: 'longTermMedication', label: 'Long term medication' }
                ].map(({ key, label }) => (
                  <FormField
                    key={key}
                    control={form.control}
                    name={key as any}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>{label}</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              {/* Conditional detail fields */}
              {form.watch('cancer') && (
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="cancerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cancer Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Specify cancer type" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cancerDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cancer Date</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {form.watch('orthodontics') && (
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="orthodonticsName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Orthodontics Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Specify orthodontics type" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="orthodonticsDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Orthodontics Date</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {form.watch('immuneSystemCondition') && (
                <FormField
                  control={form.control}
                  name="immuneSystemDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Immune System Details</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Skin inflammation, Lupus erythematosus, Rosacea, etc"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {form.watch('surgery') && (
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="surgeryName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Surgery Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Specify surgery type" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="surgeryDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Surgery Date</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {form.watch('sensitiveToLight') && (
                <FormField
                  control={form.control}
                  name="lightSensitivityDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Light Sensitivity Details</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Please specify light sensitivity details..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {form.watch('substanceAllergies') && (
                <FormField
                  control={form.control}
                  name="allergyDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Allergy Details</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Please specify allergies..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {form.watch('longTermMedication') && (
                <FormField
                  control={form.control}
                  name="medicationDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medication Details</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Please specify medications..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* Treatment Area Conditions */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Treatment Area has:</h4>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { key: 'implants', label: 'Implants' },
                  { key: 'metalStent', label: 'Metal stent' },
                  { key: 'threadLifting', label: 'Thread lifting' },
                  { key: 'hypertrophicScar', label: 'Hypertrophic scar' }
                ].map(({ key, label }) => (
                  <FormField
                    key={key}
                    control={form.control}
                    name={key as any}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>{label}</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>

          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit">Create Client</Button>
        </div>
      </form>
    </Form >
  )
}
