import { useState, useEffect } from 'react'
import { appointmentService } from '../services/appointment.service'
import { paymentService } from '../services/payment.service'
import { customerService } from '../services/customer.service'
import { useAuth } from '../context/useAuth'

// Stats card component — reusable
function StatsCard({ title, value, subtitle, icon, color }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${color}`}>
          {subtitle}
        </span>
      </div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{title}</p>
    </div>
  )
}

// Appointment row component — reusable
function AppointmentRow({ appointment }) {
  const statusColors = {
    scheduled:  'bg-blue-50 text-blue-700',
    completed:  'bg-green-50 text-green-700',
    cancelled:  'bg-red-50 text-red-700',
  }

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-sm">
          {appointment.customers?.name_en?.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800">
            {appointment.customers?.name_en}
          </p>
          <p className="text-xs text-gray-400">
            {appointment.services?.name_en} • {appointment.time?.slice(0, 5)}
          </p>
        </div>
      </div>
      <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${statusColors[appointment.status]}`}>
        {appointment.status}
      </span>
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    customers: 0,
    todayAppointments: 0,
    totalRevenue: 0,
    pendingAppointments: 0
  })
  const [todayAppointments, setTodayAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0]

      // Fetch all data in parallel — faster than sequential
      const [customersRes, appointmentsRes, revenueRes] = await Promise.all([
        customerService.getAll(),
        appointmentService.getAll(today),
        paymentService.getSummary()
      ])

      const todayAppts = appointmentsRes.data || []

      setStats({
        customers: customersRes.count || 0,
        todayAppointments: todayAppts.length,
        totalRevenue: revenueRes.data?.totalRevenue || 0,
        pendingAppointments: todayAppts.filter(a => a.status === 'scheduled').length
      })

      setTodayAppointments(todayAppts)
    } catch (error) {
      console.error('Dashboard error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* Welcome message */}
      <div>
        <h2 className="text-xl font-bold text-gray-800">
          Good {new Date().getHours() < 12 ? 'morning' : 'afternoon'}, {user?.name?.split(' ')[0]} 👋
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Here's what's happening at {user?.tenant?.name_en} today.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Customers"
          value={stats.customers}
          subtitle="All time"
          icon="👥"
          color="bg-blue-50 text-blue-600"
        />
        <StatsCard
          title="Today's Appointments"
          value={stats.todayAppointments}
          subtitle="Today"
          icon="📅"
          color="bg-purple-50 text-purple-600"
        />
        <StatsCard
          title="Pending"
          value={stats.pendingAppointments}
          subtitle="Scheduled"
          icon="⏳"
          color="bg-yellow-50 text-yellow-600"
        />
        <StatsCard
          title="Total Revenue"
          value={`${stats.totalRevenue.toLocaleString()} SAR`}
          subtitle="All time"
          icon="💰"
          color="bg-green-50 text-green-600"
        />
      </div>

      {/* Today's appointments */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h3 className="text-base font-semibold text-gray-800 mb-4">
          📅 Today's Appointments
        </h3>

        {todayAppointments.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p className="text-3xl mb-2">📭</p>
            <p className="text-sm">No appointments scheduled for today</p>
          </div>
        ) : (
          <div>
            {todayAppointments.map(appointment => (
              <AppointmentRow
                key={appointment.id}
                appointment={appointment}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  )
}