
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Cpu, Zap, Laptop, Smartphone, ChevronRight } from 'lucide-react';

export const AppleSection: React.FC = () => {
  return (
    <section className="bg-black py-24 md:py-32 px-4 md:px-8 border-t border-gray-900">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
          <div className="space-y-2">
            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
              LEGO <span className="text-gray-500">x</span> Apple
            </h2>
            <p className="text-xl text-gray-400 font-medium">Zaprojektowane, by inspirować.</p>
          </div>
          <Link 
            to="/apple-zone" 
            className="group flex items-center gap-2 text-blue-500 font-medium text-lg hover:text-blue-400 transition-colors"
          >
            Zobacz kolekcję <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform"/>
          </Link>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 h-auto md:h-[600px]">
          
          {/* Main Card (Large) */}
          <Link to="/apple-zone" className="group relative col-span-1 md:col-span-2 row-span-2 rounded-[2rem] overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-20 bg-gradient-to-t from-black/90 to-transparent">
              <div className="flex items-center gap-2 text-zinc-400 text-sm font-bold uppercase tracking-widest mb-2">
                <Cpu size={16} /> Titanium Edition
              </div>
              <h3 className="text-4xl md:text-5xl font-bold text-white mb-4">iBrick 15 Pro Max.</h3>
              <p className="text-zinc-400 max-w-md text-lg">Tak lekki. Tak wytrzymały. Tak kanciasty. Wykonany z tytanu klasy lotniczej połączonego z plastikiem ABS.</p>
            </div>
            {/* Abstract Visual */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-zinc-800 rounded-full blur-[100px] group-hover:bg-blue-900/30 transition-colors duration-700"></div>
            <Smartphone className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-zinc-800 w-64 h-64 group-hover:scale-110 group-hover:text-zinc-700 transition-all duration-700 ease-out" strokeWidth={0.5} />
          </Link>

          {/* Secondary Card (Mac) */}
          <Link to="/apple-zone" className="group relative col-span-1 row-span-1 rounded-[2rem] overflow-hidden bg-zinc-100 border border-zinc-200 hover:border-zinc-300 transition-all duration-500">
            <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
              <div>
                <h3 className="text-3xl font-bold text-black mb-1">MacBrick Air.</h3>
                <p className="text-zinc-500 font-medium">Cieńszy niż klocek 2x4.</p>
              </div>
              <div className="self-end">
                <ArrowRight className="text-black group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
            <Laptop className="absolute -bottom-12 -right-12 w-48 h-48 text-zinc-200 group-hover:scale-105 group-hover:-rotate-6 transition-all duration-500" strokeWidth={0.5} />
          </Link>

          {/* Tertiary Card (Vision) */}
          <Link to="/apple-zone" className="group relative col-span-1 row-span-1 rounded-[2rem] overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-orange-500/30 transition-all duration-500">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-orange-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
              <div>
                <h3 className="text-3xl font-bold text-white mb-1">Vision Brick.</h3>
                <p className="text-zinc-500 font-medium">Przestrzenne budowanie.</p>
              </div>
              <div className="self-end">
                <ArrowRight className="text-white group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
            <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 text-zinc-800 group-hover:text-orange-500/50 transition-colors duration-500" />
          </Link>

        </div>
      </div>
    </section>
  );
};
