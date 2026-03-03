import React, { createContext, useContext, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Link as LinkIcon, Twitter, MessageCircle, MoreHorizontal } from 'lucide-react';
import { toast } from "sonner";

interface OverlayContextType {
  openShare: (url: string) => void;
  openReport: (postId: string) => void;
  openLightbox: (image: string) => void;
}

const OverlayContext = createContext<OverlayContextType | undefined>(undefined);

export const useOverlays = () => {
  const context = useContext(OverlayContext);
  if (!context) throw new Error('useOverlays must be used within OverlayProvider');
  return context;
};

export const OverlayProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [reportId, setReportId] = useState<string | null>(null);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  const openShare = (url: string) => setShareUrl(url);
  const openReport = (postId: string) => setReportId(postId);
  const openLightbox = (image: string) => setLightboxImg(image);

  return (
    <OverlayContext.Provider value={{ openShare, openReport, openLightbox }}>
      {children}
      
      {/* Share Modal */}
      <Dialog open={!!shareUrl} onOpenChange={(open) => !open && setShareUrl(null)}>
        <DialogContent className="sm:max-w-[420px] rounded-t-[32px] sm:rounded-[32px] p-0 overflow-hidden border-none shadow-ios-float">
          <div className="w-12 h-1.5 bg-neutral-300 dark:bg-neutral-700 rounded-full mx-auto mt-4 sm:hidden opacity-50"></div>
          <DialogHeader className="p-6 border-b border-border">
            <DialogTitle className="text-[20px] font-bold tracking-tight">Share</DialogTitle>
          </DialogHeader>
          <div className="p-6 grid grid-cols-4 gap-4 text-center">
            <button 
              className="flex flex-col items-center gap-3 group active:scale-95 transition-transform"
              onClick={() => {
                navigator.clipboard.writeText(shareUrl || '');
                toast.success("Link copied to clipboard!");
                setShareUrl(null);
              }}
            >
              <div className="w-16 h-16 rounded-[20px] bg-muted flex items-center justify-center group-hover:bg-neutral-200 dark:group-hover:bg-neutral-700 transition-colors shadow-sm">
                <LinkIcon size={28} className="text-foreground" />
              </div>
              <span className="text-[13px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">Copy Link</span>
            </button>
            <button className="flex flex-col items-center gap-3 group active:scale-95 transition-transform">
              <div className="w-16 h-16 rounded-[20px] bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors shadow-sm">
                <MessageCircle size={28} className="text-green-500" />
              </div>
              <span className="text-[13px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">WhatsApp</span>
            </button>
            <button className="flex flex-col items-center gap-3 group active:scale-95 transition-transform">
              <div className="w-16 h-16 rounded-[20px] bg-blue-400/10 flex items-center justify-center group-hover:bg-blue-400/20 transition-colors shadow-sm">
                <Twitter size={28} className="text-blue-400" />
              </div>
              <span className="text-[13px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">Twitter</span>
            </button>
            <button className="flex flex-col items-center gap-3 group active:scale-95 transition-transform">
              <div className="w-16 h-16 rounded-[20px] bg-muted flex items-center justify-center group-hover:bg-neutral-200 dark:group-hover:bg-neutral-700 transition-colors shadow-sm">
                <MoreHorizontal size={28} className="text-foreground" />
              </div>
              <span className="text-[13px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">More</span>
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Report Modal */}
      <Dialog open={!!reportId} onOpenChange={(open) => !open && setReportId(null)}>
        <DialogContent className="sm:max-w-[480px] rounded-t-[32px] sm:rounded-[32px] p-0 overflow-hidden border-none shadow-ios-float max-h-[90vh] flex flex-col">
          <div className="w-12 h-1.5 bg-neutral-300 dark:bg-neutral-700 rounded-full mx-auto mt-4 sm:hidden opacity-50 shrink-0"></div>
          <DialogHeader className="p-6 border-b border-border shrink-0">
            <DialogTitle className="text-[20px] font-bold tracking-tight">Submit a Report</DialogTitle>
          </DialogHeader>
          <div className="p-6 overflow-y-auto no-scrollbar flex-1">
            <p className="text-[15px] text-muted-foreground mb-6 leading-relaxed">Let us know what's happening, and we'll look into it.</p>
            <div className="space-y-3">
              {['Spam', 'Harassment', 'Breaks community rules'].map((reason, i) => (
                <label key={reason} className="flex items-center justify-between p-4 border border-border rounded-[16px] hover:bg-muted cursor-pointer transition-all active:scale-[0.98] group">
                  <span className="text-[16px] font-semibold text-foreground">{reason}</span>
                  <input type="radio" name="report_reason" defaultChecked={i === 0} className="w-6 h-6 accent-primary" />
                </label>
              ))}
            </div>
          </div>
          <div className="p-6 border-t border-border bg-muted/50 flex justify-end gap-3 shrink-0">
            <Button variant="ghost" onClick={() => setReportId(null)} className="px-6 py-3.5 rounded-full font-semibold">Cancel</Button>
            <Button 
              onClick={() => {
                toast.success("Report submitted. Thank you.");
                setReportId(null);
              }}
              className="px-8 py-3.5 rounded-full font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-sm border-none"
            >
              Submit Report
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Lightbox */}
      {lightboxImg && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex flex-col animate-in fade-in duration-300">
          <div className="flex justify-between items-center p-4 pt-[calc(1rem+env(safe-area-inset-top))] shrink-0 text-white">
            <span className="text-[14px] font-semibold px-4 py-2 bg-white/10 rounded-full backdrop-blur-xl">1/1</span>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setLightboxImg(null)}
              className="w-11 h-11 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-xl transition-colors"
            >
              <X size={24} />
            </Button>
          </div>
          <div className="flex-1 flex items-center justify-center p-4 relative overflow-hidden" onClick={() => setLightboxImg(null)}>
            <img 
              src={lightboxImg} 
              alt="Fullscreen" 
              className="max-w-full max-h-full object-contain drop-shadow-2xl scale-100 transition-transform duration-300 rounded-[8px]" 
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </OverlayContext.Provider>
  );
};
