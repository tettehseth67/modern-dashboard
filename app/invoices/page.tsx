"use client"
import { useState, useEffect } from "react"
import { supabase } from "@/utils/supabase"
import { Trash2, Plus, FileText } from "lucide-react"

export default function InvoiceLedger() {
  const [invoices, setInvoices] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalBilling, setTotalBilling] = useState(0)
  const [totalPaid, setTotalPaid] = useState(0)
  const [totalDue, setTotalDue] = useState(0)

  useEffect(() => {
    fetchInvoices()
  }, [])

  const fetchInvoices = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setInvoices(data || [])
      calculateTotals(data || [])
    } catch (error) {
      console.error('Error fetching invoices:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const calculateTotals = (data: any[]) => {
    const billing = data.reduce((sum, invoice) => sum + (invoice.amount || 0), 0)
    const paid = data.reduce((sum, invoice) => sum + (invoice.paid_amount || 0), 0)
    const due = billing - paid

    setTotalBilling(billing)
    setTotalPaid(paid)
    setTotalDue(due)
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchInvoices()
    } catch (error) {
      console.error('Error deleting invoice:', error)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value)
  }

  return (
    <div className="p-6 bg-slate-900 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <FileText className="h-6 w-6" />
          Invoice Ledger
        </h1>
        <button className="bg-slate-700 hover:bg-slate-600 text-slate-100 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Plus className="h-4 w-4" />
          New Invoice
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <p className="text-slate-400 text-sm mb-1">Total Billing</p>
          <p className="text-3xl font-bold text-slate-100">{formatCurrency(totalBilling)}</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <p className="text-slate-400 text-sm mb-1">Total Paid</p>
          <p className="text-3xl font-bold text-emerald-400">{formatCurrency(totalPaid)}</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <p className="text-slate-400 text-sm mb-1">Total Due</p>
          <p className="text-3xl font-bold text-rose-400">{formatCurrency(totalDue)}</p>
        </div>
      </div>

      {/* Invoice Table */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-700">
              <tr>
                <th className="px-6 py-4 text-sm font-medium text-slate-300">Invoice #</th>
                <th className="px-6 py-4 text-sm font-medium text-slate-300">Client</th>
                <th className="px-6 py-4 text-sm font-medium text-slate-300">Date</th>
                <th className="px-6 py-4 text-sm font-medium text-slate-300">Amount</th>
                <th className="px-6 py-4 text-sm font-medium text-slate-300">Paid</th>
                <th className="px-6 py-4 text-sm font-medium text-slate-300">Due</th>
                <th className="px-6 py-4 text-sm font-medium text-slate-300">Status</th>
                <th className="px-6 py-4 text-sm font-medium text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-slate-400">
                    Loading invoices...
                  </td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-slate-400">
                    No invoices found
                  </td>
                </tr>
              ) : (
                invoices.map((invoice) => {
                  const dueAmount = (invoice.amount || 0) - (invoice.paid_amount || 0)
                  const isPaid = dueAmount <= 0

                  return (
                    <tr key={invoice.id} className="border-t border-slate-700 hover:bg-slate-750/50">
                      <td className="px-6 py-4 text-slate-100">{invoice.invoice_number || 'N/A'}</td>
                      <td className="px-6 py-4 text-slate-300">{invoice.client_name || 'N/A'}</td>
                      <td className="px-6 py-4 text-slate-400">
                        {new Date(invoice.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-slate-100 font-medium">
                        {formatCurrency(invoice.amount || 0)}
                      </td>
                      <td className="px-6 py-4 text-emerald-400 font-medium">
                        {formatCurrency(invoice.paid_amount || 0)}
                      </td>
                      <td className="px-6 py-4 font-medium">
                        <span className={dueAmount > 0 ? 'text-rose-400' : 'text-slate-400'}>
                          {formatCurrency(dueAmount)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          isPaid
                            ? 'bg-emerald-900/50 text-emerald-300'
                            : 'bg-rose-900/50 text-rose-300'
                        }`}>
                          {isPaid ? 'Paid' : 'Unpaid'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDelete(invoice.id)}
                          className="text-slate-400 hover:text-rose-400 transition-colors"
                          title="Delete invoice"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}