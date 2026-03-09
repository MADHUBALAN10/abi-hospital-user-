import React, { useState, useMemo } from 'react';
import {
    FaMoneyBillWave, FaFilePdf, FaCheckCircle, FaClock,
    FaSearch, FaFilter, FaDownload, FaReceipt,
    FaUserMd, FaCalendarAlt, FaRupeeSign
} from 'react-icons/fa';

/* ─── PDF Invoice Generator ─────────────────────────────── */
const generateInvoicePDF = (appt, invoiceNo) => {
    const patientName = appt.patientId?.name || 'Patient';
    const doctorName  = appt.doctorId?.userId?.name || 'Doctor';
    const docSpec     = appt.doctorId?.specialization || '';
    const date        = appt.date ? new Date(appt.date).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'long', year: 'numeric'
    }) : '—';
    const time        = appt.timeSlot || '—';
    const amount      = appt.paymentAmount || 0;
    const payId       = appt.paymentId || `PAY${invoiceNo}`;
    const status      = appt.paymentStatus || 'pending';
    const statusLabel = ['paid','completed','Paid','Completed'].includes(status) ? 'PAID' : status.toUpperCase();
    const statusColor = statusLabel === 'PAID' ? '#10b981' : '#f59e0b';

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Invoice #INV-${invoiceNo}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #f8fafc; color: #0f172a; padding: 40px; }
    .page { max-width: 680px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,.1); }
    .header { background: linear-gradient(135deg, #0891b2, #06b6d4); padding: 36px 40px; color: white; display: flex; justify-content: space-between; align-items: flex-start; }
    .header h1 { font-size: 28px; font-weight: 800; letter-spacing: -0.5px; }
    .header p  { font-size: 13px; opacity: .85; margin-top: 4px; }
    .badge { background: rgba(255,255,255,.2); border: 1.5px solid rgba(255,255,255,.4); border-radius: 8px; padding: 8px 16px; font-size: 13px; font-weight: 700; text-align: center; }
    .badge .inv { font-size: 18px; font-weight: 800; display: block; }
    .body { padding: 36px 40px; }
    .row { display: flex; gap: 24px; margin-bottom: 24px; }
    .col { flex: 1; background: #f8fafc; border-radius: 12px; padding: 18px 20px; border: 1px solid #e2e8f0; }
    .col label { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: .06em; display: block; margin-bottom: 6px; }
    .col p { font-size: 15px; font-weight: 600; color: #0f172a; }
    .col .sub { font-size: 12px; color: #64748b; font-weight: 500; margin-top: 2px; }
    .divider { height: 1px; background: #e2e8f0; margin: 8px 0 24px; }
    table { width: 100%; border-collapse: collapse; }
    thead tr { background: #f1f5f9; }
    th { text-align: left; padding: 12px 16px; font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: .06em; }
    td { padding: 16px; font-size: 14px; font-weight: 500; color: #0f172a; border-bottom: 1px solid #f1f5f9; }
    .total-row { background: #f8fafc; }
    .total-row td { font-weight: 700; font-size: 16px; padding: 18px 16px; border-bottom: none; }
    .status-pill { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; background: ${statusColor}22; color: ${statusColor}; }
    .footer { background: #f8fafc; padding: 20px 40px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; }
    .footer p { font-size: 12px; color: #94a3b8; }
    .footer .thank { font-size: 14px; font-weight: 700; color: #0891b2; }
    @media print { body { background: white; padding: 0; } .page { box-shadow: none; border-radius: 0; } }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div>
        <h1>🏥 MediCare+</h1>
        <p>Hospital Management System</p>
        <p style="margin-top:8px; font-size:12px; opacity:.7;">123 Health Avenue, Medical City · info@medicare.com</p>
      </div>
      <div class="badge">
        <span>INVOICE</span>
        <span class="inv">#INV-${invoiceNo}</span>
        <span style="font-size:11px; opacity:.8; display:block; margin-top:4px;">${new Date().toLocaleDateString('en-IN')}</span>
      </div>
    </div>

    <div class="body">
      <div class="row">
        <div class="col">
          <label>Patient</label>
          <p>${patientName}</p>
          <p class="sub">${appt.patientId?.email || ''}</p>
        </div>
        <div class="col">
          <label>Consulting Doctor</label>
          <p>Dr. ${doctorName}</p>
          <p class="sub">${docSpec}</p>
        </div>
        <div class="col">
          <label>Appointment</label>
          <p>${date}</p>
          <p class="sub">${time}</p>
        </div>
      </div>

      <div class="divider"></div>

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Description</th>
            <th>Payment ID</th>
            <th style="text-align:right">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>
              Consultation Fee<br/>
              <span style="font-size:12px; color:#64748b;">Dr. ${doctorName} · ${docSpec}</span>
            </td>
            <td><span style="font-family:monospace; font-size:12px; color:#64748b;">${payId}</span></td>
            <td style="text-align:right; font-weight:700;">₹${amount.toLocaleString('en-IN')}</td>
          </tr>
          <tr class="total-row">
            <td colspan="3" style="text-align:right; color:#64748b;">Total Amount</td>
            <td style="text-align:right; color:#0891b2; font-size:18px;">₹${amount.toLocaleString('en-IN')}</td>
          </tr>
        </tbody>
      </table>

      <div style="margin-top:24px; display:flex; justify-content:space-between; align-items:center; background:#f8fafc; border-radius:12px; padding:16px 20px; border:1px solid #e2e8f0;">
        <div>
          <p style="font-size:12px; color:#64748b; font-weight:600; text-transform:uppercase; letter-spacing:.06em;">Payment Status</p>
          <span class="status-pill">${statusLabel}</span>
        </div>
        ${appt.diagnosis ? `<div><p style="font-size:12px; color:#64748b; margin-bottom:4px;">Diagnosis</p><p style="font-weight:600;">${appt.diagnosis}</p></div>` : ''}
        ${appt.prescription ? `<div><p style="font-size:12px; color:#64748b; margin-bottom:4px;">Prescription</p><p style="font-weight:600; font-size:12px; max-width:200px;">${appt.prescription}</p></div>` : ''}
      </div>
    </div>

    <div class="footer">
      <p>Generated on ${new Date().toLocaleString('en-IN')} · MediCare+ System</p>
      <p class="thank">Thank you for choosing MediCare+ 💙</p>
    </div>
  </div>
</body>
</html>`;

    const win = window.open('', '_blank', 'width=750,height=900');
    win.document.write(html);
    win.document.close();
    setTimeout(() => win.print(), 600);
};

/* ─── Status helpers ─────────────────────────────────────── */
const isPaid = (s) => ['paid', 'completed', 'Paid', 'Completed'].includes(s);
const isPending = (s) => ['pending', 'Pending'].includes(s);

const statusBadge = (status) => {
    if (isPaid(status)) return { label: 'Paid', bg: '#d1fae5', color: '#065f46' };
    if (isPending(status)) return { label: 'Pending', bg: '#fef3c7', color: '#92400e' };
    return { label: status, bg: '#e0f2fe', color: '#0369a1' };
};

/* ─── Component ──────────────────────────────────────────── */
const Payments = ({ appointments, stats }) => {
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all'); // all | paid | pending

    const allPayments = useMemo(() =>
        appointments.filter((a) => a.paymentAmount > 0 || a.paymentStatus),
        [appointments]
    );

    const filtered = useMemo(() => {
        let data = allPayments;
        if (filter === 'paid')    data = data.filter((a) => isPaid(a.paymentStatus));
        if (filter === 'pending') data = data.filter((a) => isPending(a.paymentStatus));
        if (search.trim()) {
            const q = search.toLowerCase();
            data = data.filter((a) =>
                (a.patientId?.name || '').toLowerCase().includes(q) ||
                (a.doctorId?.userId?.name || '').toLowerCase().includes(q) ||
                (a.paymentId || '').toLowerCase().includes(q)
            );
        }
        return data;
    }, [allPayments, filter, search]);

    const totalRevenue = allPayments.filter((a) => isPaid(a.paymentStatus)).reduce((s, a) => s + (a.paymentAmount || 0), 0);
    const totalPending = allPayments.filter((a) => isPending(a.paymentStatus)).reduce((s, a) => s + (a.paymentAmount || 0), 0);
    const paidCount    = allPayments.filter((a) => isPaid(a.paymentStatus)).length;
    const pendingCount = allPayments.filter((a) => isPending(a.paymentStatus)).length;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* ── Stats Row ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                {[
                    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, icon: <FaRupeeSign />, color: '#0891b2', bg: '#e0f2fe' },
                    { label: 'Paid Bills',    value: paidCount,    icon: <FaCheckCircle />, color: '#10b981', bg: '#d1fae5' },
                    { label: 'Pending Bills', value: pendingCount, icon: <FaClock />,        color: '#f59e0b', bg: '#fef3c7' },
                    { label: 'Pending Amount',value: `₹${totalPending.toLocaleString('en-IN')}`, icon: <FaMoneyBillWave />, color: '#6366f1', bg: '#ede9fe' },
                ].map((s, i) => (
                    <div key={i} style={{ background: 'white', borderRadius: 16, padding: '1.25rem 1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,.04)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: s.bg, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>
                            {s.icon}
                        </div>
                        <div>
                            <p style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, marginBottom: 2 }}>{s.label}</p>
                            <p style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>{s.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Main Table Card ── */}
            <div className="admin-glass-card" style={{ padding: '1.75rem' }}>

                {/* Header Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FaReceipt style={{ color: '#0891b2' }} /> Payment Records
                        </h3>
                        <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: '#64748b' }}>
                            {allPayments.length} total appointments · {paidCount} paid
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        {/* Search */}
                        <div style={{ position: 'relative' }}>
                            <FaSearch style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.8rem' }} />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search patient, doctor…"
                                style={{ paddingLeft: 34, paddingRight: 12, paddingTop: 9, paddingBottom: 9, borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: '0.875rem', outline: 'none', background: '#f8fafc', width: 210, color: '#0f172a' }}
                            />
                        </div>

                        {/* Filter Tabs */}
                        <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: 10, padding: 3, gap: 2 }}>
                            {[['all','All'],['paid','Paid'],['pending','Pending']].map(([val, lbl]) => (
                                <button
                                    key={val}
                                    onClick={() => setFilter(val)}
                                    style={{ padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.8125rem', background: filter === val ? 'white' : 'transparent', color: filter === val ? '#0891b2' : '#64748b', boxShadow: filter === val ? '0 1px 4px rgba(0,0,0,.08)' : 'none', transition: 'all 0.15s' }}
                                >
                                    {lbl}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Table */}
                {filtered.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>💳</div>
                        <p style={{ fontWeight: 600, fontSize: '1rem' }}>No payment records found</p>
                        <p style={{ fontSize: '0.875rem', marginTop: 4 }}>Try adjusting the filter or search</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: '#f8fafc', borderRadius: 10 }}>
                                    {['Invoice', 'Patient', 'Doctor', 'Date & Time', 'Amount', 'Status', 'Action'].map((h) => (
                                        <th key={h} style={{ padding: '11px 14px', textAlign: 'left', fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap', borderBottom: '2px solid #e2e8f0' }}>
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((appt, i) => {
                                    const sb = statusBadge(appt.paymentStatus);
                                    const invoiceNo = String(889900 + i + 1).padStart(6, '0');
                                    const apptDate  = appt.date ? new Date(appt.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
                                    const docName   = appt.doctorId?.userId?.name || 'Doctor';
                                    const patName   = appt.patientId?.name || 'Patient';

                                    return (
                                        <tr key={appt._id || i} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s' }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                        >
                                            {/* Invoice # */}
                                            <td style={{ padding: '14px', whiteSpace: 'nowrap' }}>
                                                <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', fontWeight: 700, color: '#0891b2', background: '#e0f2fe', padding: '3px 8px', borderRadius: 6 }}>
                                                    #INV-{invoiceNo}
                                                </span>
                                            </td>

                                            {/* Patient */}
                                            <td style={{ padding: '14px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                                    <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,#0891b2,#06b6d4)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0 }}>
                                                        {patName[0]?.toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9rem', marginBottom: 2 }}>{patName}</p>
                                                        <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{appt.patientId?.email || ''}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Doctor */}
                                            <td style={{ padding: '14px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <FaUserMd style={{ color: '#0891b2', flexShrink: 0 }} />
                                                    <div>
                                                        <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#0f172a' }}>Dr. {docName}</p>
                                                        <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{appt.doctorId?.specialization || ''}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Date */}
                                            <td style={{ padding: '14px', whiteSpace: 'nowrap' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                    <FaCalendarAlt style={{ color: '#94a3b8', fontSize: '0.8rem' }} />
                                                    <div>
                                                        <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#0f172a' }}>{apptDate}</p>
                                                        <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{appt.timeSlot || '—'}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Amount */}
                                            <td style={{ padding: '14px', whiteSpace: 'nowrap' }}>
                                                <p style={{ fontWeight: 800, fontSize: '1rem', color: isPaid(appt.paymentStatus) ? '#10b981' : '#f59e0b' }}>
                                                    ₹{(appt.paymentAmount || 0).toLocaleString('en-IN')}
                                                </p>
                                            </td>

                                            {/* Status */}
                                            <td style={{ padding: '14px' }}>
                                                <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700, background: sb.bg, color: sb.color }}>
                                                    {sb.label}
                                                </span>
                                            </td>

                                            {/* Action */}
                                            <td style={{ padding: '14px' }}>
                                                <button
                                                    onClick={() => generateInvoicePDF(appt, invoiceNo)}
                                                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '7px 14px', borderRadius: 8, border: '1.5px solid #e2e8f0', background: 'white', color: '#0891b2', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
                                                    onMouseEnter={(e) => { e.currentTarget.style.background = '#e0f2fe'; e.currentTarget.style.borderColor = '#bae6fd'; }}
                                                    onMouseLeave={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                                                >
                                                    <FaFilePdf style={{ color: '#dc2626' }} /> Invoice PDF
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ── Revenue Summary Card ── */}
            <div style={{ background: 'linear-gradient(135deg, #0891b2, #0e7490)', borderRadius: 20, padding: '2rem 2.5rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, background: 'rgba(255,255,255,.07)', borderRadius: '50%' }} />
                <div style={{ position: 'absolute', bottom: -60, left: -30, width: 220, height: 220, background: 'rgba(255,255,255,.05)', borderRadius: '50%' }} />
                <div style={{ position: 'relative' }}>
                    <p style={{ fontSize: '0.875rem', opacity: .8, marginBottom: 6 }}>Total Collected Revenue</p>
                    <p style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1px' }}>₹{totalRevenue.toLocaleString('en-IN')}</p>
                    <p style={{ fontSize: '0.8rem', opacity: .7, marginTop: 6 }}>{paidCount} paid appointments</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', position: 'relative', flexWrap: 'wrap' }}>
                    <div style={{ background: 'rgba(255,255,255,.15)', borderRadius: 14, padding: '1rem 1.5rem', backdropFilter: 'blur(8px)', textAlign: 'center', minWidth: 110 }}>
                        <p style={{ fontSize: '0.75rem', opacity: .8, marginBottom: 4 }}>Pending</p>
                        <p style={{ fontSize: '1.35rem', fontWeight: 800 }}>₹{totalPending.toLocaleString('en-IN')}</p>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,.15)', borderRadius: 14, padding: '1rem 1.5rem', backdropFilter: 'blur(8px)', textAlign: 'center', minWidth: 110 }}>
                        <p style={{ fontSize: '0.75rem', opacity: .8, marginBottom: 4 }}>All Bills</p>
                        <p style={{ fontSize: '1.35rem', fontWeight: 800 }}>{allPayments.length}</p>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Payments;
