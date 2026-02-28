import { ShieldAlert } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-background border-t border-slate-200 mt-auto py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center justify-center space-y-6">
                    <div className="flex items-center gap-3 text-slate-400 bg-white border border-slate-200 px-5 py-2.5 rounded shadow-sm text-[10px] font-bold uppercase tracking-widest">
                        <ShieldAlert className="h-3 w-3" />
                        <span>System Disclaimer: Quantitative analysis provided for informational purposes only.</span>
                    </div>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                        © {new Date().getFullYear()} Proprietary Intelligence Terminal. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

