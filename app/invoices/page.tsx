"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";
import { Trash2, Plus, FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function InvoiceLedger() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalBilling, setTotalBilling] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [totalDue, setTotalDue] = useState(0);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("invoices")
        .select("*")
        .order("createdAt", { ascending: false });

      if (error) throw error;
      setInvoices(data || []);
      calculateTotals(data || []);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Converts currency text strings like "$4,800.00" safely into floats for accurate metrics
  const parseCurrencyToNumber = (amountStr: any): number => {
    if (!amountStr) return 0;
    if (typeof amountStr === "number") return amountStr;
    const cleaned = amountStr.replace(/[^0-9.-]+/g, "");
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  };

  const calculateTotals = (data: any[]) => {
    let billing = 0;
    let paid = 0;

    data.forEach((invoice) => {
      const numericAmount = parseCurrencyToNumber(invoice.amount);
      billing += numericAmount;

      // Map status flags to totals dynamically
      if (invoice.status === "Active") {
        paid += numericAmount; // Simulating paid allocation
      } else if (invoice.status === "Pending") {
        paid += numericAmount * 0.3; // Simulating standard downpayments
      }
    });

    const due = billing - paid;
    setTotalBilling(billing);
    setTotalPaid(paid);
    setTotalDue(due);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("invoices").delete().eq("id", id);

      if (error) throw error;
      fetchInvoices();
    } catch (error) {
      console.error("Error deleting invoice:", error);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  return (
    <div className="p-6 bg-slate-900 min-h-screen">
      <div className="mb-4">
        <Link
          href="/"
          className="text-xs text-blue-400 hover:underline flex items-center gap-1"
        >
          ← Back to Workspace Summary
        </Link>
      </div>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <FileText className="h-6 w-6" /> Invoice Ledger
        </h1>
        <button className="bg-slate-700 hover:bg-slate-600 text-slate-100 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors cursor-pointer">
          <Plus className="h-4 w-4" /> New Invoice
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <p className="text-slate-400 text-sm mb-1">Total Billing</p>
          <p className="text-3xl font-bold text-slate-100">
            {formatCurrency(totalBilling)}
          </p>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <p className="text-slate-400 text-sm mb-1">Total Paid</p>
          <p className="text-3xl font-bold text-emerald-400">
            {formatCurrency(totalPaid)}
          </p>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <p className="text-slate-400 text-sm mb-1">Total Due</p>
          <p className="text-3xl font-bold text-rose-400">
            {formatCurrency(totalDue)}
          </p>
        </div>
      </div>

      {/* Invoice Table */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-700">
              <tr>
                <th className="px-6 py-4 text-sm font-medium text-slate-300">
                  Invoice ID
                </th>
                <th className="px-6 py-4 text-sm font-medium text-slate-300">
                  Statement Title Description
                </th>
                <th className="px-6 py-4 text-sm font-medium text-slate-300">
                  Date Logged
                </th>
                <th className="px-6 py-4 text-sm font-medium text-slate-300">
                  Total Allocation
                </th>
                <th className="px-6 py-4 text-sm font-medium text-slate-300">
                  Status
                </th>
                <th className="px-6 py-4 text-sm font-medium text-slate-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-slate-400"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      Syncing cloud financial ledger tracks...
                    </div>
                  </td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-slate-400"
                  >
                    No active invoice records located in cloud database.
                  </td>
                </tr>
              ) : (
                invoices.map((invoice) => {
                  const isPaid = invoice.status === "Active";
                  return (
                    <tr
                      key={invoice.id}
                      className="hover:bg-slate-700/30 transition-colors"
                    >
                      <td className="px-6 py-4 text-blue-400 font-mono text-xs font-semibold">
                        {invoice.id}
                      </td>
                      <td className="px-6 py-4 text-slate-200 font-medium">
                        {invoice.title || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-slate-400 font-mono text-xs">
                        {invoice.createdAt
                          ? new Date(invoice.createdAt).toLocaleDateString()
                          : "Recent"}
                      </td>
                      <td className="px-6 py-4 text-slate-100 font-mono font-medium">
                        {invoice.amount || "$0.00"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            invoice.status === "Active"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : invoice.status === "Pending"
                                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          }`}
                        >
                          {invoice.status || "Unknown"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDelete(invoice.id)}
                          className="text-slate-400 hover:text-rose-400 p-1.5 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer inline-flex items-center"
                          title="Delete invoice"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
