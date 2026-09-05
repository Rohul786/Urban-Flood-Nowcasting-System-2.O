import React, { useState } from 'react';
import { useFlood } from '../context/FloodContext';
import { 
  BellRing, 
  Send, 
  Radio, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Users, 
  Share2, 
  ShieldAlert,
  Download
} from 'lucide-react';
import { FloodAlert, AlertSeverity } from '../types';

export const AlertsCenter: React.FC = () => {
  const { alerts, sendCitizenAlert, acknowledgeAlert, emergencyMode, showToast } = useFlood();
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');

  const filteredAlerts = alerts.filter(a => {
    if (selectedSeverity === 'ALL') return true;
    return a.severity === selectedSeverity;
  });

  const getSeverityBadge = (sev: AlertSeverity) => {
    switch (sev) {
      case 'EMERGENCY':
      case 'SEVERE':
        return 'bg-rose-500/20 text-rose-300 border-rose-600/60 ring-1 ring-rose-500/40';
      case 'HIGH':
        return 'bg-orange-500/20 text-orange-300 border-orange-600/60 ring-1 ring-orange-500/40';
      case 'MODERATE':
        return 'bg-amber-500/20 text-amber-300 border-amber-600/60 ring-1 ring-amber-500/30';
      default:
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-600/60';
    }
  };

  const handleExportCAP = (alert: FloodAlert) => {
    const capXml = `<?xml version="1.0" encoding="UTF-8"?>
<alert xmlns="urn:oasis:names:tc:emergency:cap:1.2">
  <identifier>${alert.id}</identifier>
  <sender>NCMRWF-MoES-Kolkata-EOC</sender>
  <sent>${alert.timestamp}</sent>
  <status>Actual</status>
  <msgType>Alert</msgType>
  <scope>Public</scope>
  <info>
    <category>Met</category>
    <event>Urban Inundation</event>
    <urgency>Immediate</urgency>
    <severity>${alert.severity}</severity>
    <certainty>Observed</certainty>
    <headline>${alert.headline}</headline>
    <description>${alert.reason}</description>
    <instruction>${alert.recommendedAction}</instruction>
    <area>
      <areaDesc>${alert.locationName}</areaDesc>
    </area>
  </info>
</alert>`;

    const blob = new Blob([capXml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CAP-ALERT-${alert.id}.xml`;
    a.click();
    showToast(`Exported OASIS CAP 1.2 XML payload for ${alert.id}.`);
  };

  return (
    <div className="bg-[#151B24] border border-[#1E293B] rounded p-5 shadow-xl space-y-4 font-mono">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1E293B]">
        <div>
          <div className="flex items-center gap-2">
            <BellRing className="w-4 h-4 text-red-500 animate-pulse" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
              National Disaster Management Early Warning & CAP Dispatch
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5 font-mono">
            Compliant with ITU / OASIS Common Alerting Protocol (CAP v1.2)
          </p>
        </div>

        {/* Severity Filter Tabs */}
        <div className="flex flex-wrap gap-1.5 text-xs font-mono">
          {['ALL', 'SEVERE', 'HIGH', 'MODERATE', 'ADVISORY'].map((s) => (
            <button
              key={s}
              id={`filter-alert-${s}`}
              onClick={() => setSelectedSeverity(s)}
              className={`px-2.5 py-1 rounded text-[11px] transition-colors ${
                selectedSeverity === s
                  ? 'bg-red-600 text-white font-bold border border-red-500'
                  : 'bg-[#0A0E14] text-slate-400 hover:text-white border border-[#1E293B]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-3.5">
        {filteredAlerts.length === 0 ? (
          <div className="p-8 text-center text-slate-500 bg-[#0A0E14] rounded border border-[#1E293B] font-mono text-xs">
            No active early warnings matching the selected filter.
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              id={`alert-card-${alert.id}`}
              className={`p-4 rounded border transition-all space-y-3 relative overflow-hidden bg-[#0A0E14] border-[#1E293B] ${
                alert.severity === 'SEVERE' || alert.severity === 'EMERGENCY'
                  ? 'border-l-4 border-l-red-500'
                  : alert.severity === 'HIGH'
                  ? 'border-l-4 border-l-orange-500'
                  : 'border-l-4 border-l-amber-500'
              }`}
            >
              {/* Row 1: Severity Badge, Location, Timestamp */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${getSeverityBadge(alert.severity)}`}>
                    {alert.severity}
                  </span>
                  <span className="text-xs font-bold text-white font-mono">{alert.id}</span>
                  <span className="text-slate-600 text-xs">•</span>
                  <span className="text-xs font-semibold text-[#00D1FF] font-mono">{alert.locationName}</span>
                </div>

                <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    Inundation: <b className="text-slate-200">{alert.expectedTime}</b>
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-purple-400" />
                    At Risk: <b className="text-slate-200">{alert.affectedPopulation.toLocaleString()}</b>
                  </span>
                </div>
              </div>

              {/* Row 2: Headline & Reason */}
              <div>
                <h4 className="text-xs font-bold text-white tracking-wide font-mono uppercase">{alert.headline}</h4>
                <p className="text-[11px] text-slate-400 font-mono mt-1 leading-relaxed">
                  {alert.reason}
                </p>
              </div>

              {/* Row 3: Recommended Municipal & Citizen Action */}
              <div className="p-3 rounded bg-[#151B24] border border-[#1E293B] flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs font-mono">
                  <span className="font-bold text-slate-400 uppercase text-[10px] block">
                    ADVISORY DIRECTIVE:
                  </span>
                  <span className="text-slate-300 text-[11px]">{alert.recommendedAction}</span>
                </div>
              </div>

              {/* Row 4: Operational Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-[#1E293B]">
                <div className="text-[10px] font-mono text-slate-500">
                  Gateway: <span className="text-slate-400">NDMA CAP Gateway, Cell Broadcast SMS, Police VMS Signs</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    id={`btn-cap-xml-${alert.id}`}
                    onClick={() => handleExportCAP(alert)}
                    className="p-1.5 rounded bg-[#151B24] hover:bg-[#1E293B] text-slate-400 hover:text-white border border-[#1E293B] text-xs font-mono transition-colors flex items-center gap-1"
                    title="Export OASIS CAP XML Payload"
                  >
                    <Download className="w-3.5 h-3.5 text-[#00D1FF]" />
                    <span className="hidden sm:inline text-[11px]">CAP XML</span>
                  </button>

                  <button
                    id={`btn-send-citizen-alert-${alert.id}`}
                    onClick={() => sendCitizenAlert(alert.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-red-600 hover:bg-red-500 text-white text-xs font-bold font-mono transition-all shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>BROADCAST ALERT</span>
                  </button>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};
