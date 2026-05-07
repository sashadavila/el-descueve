import { useState } from 'react'
import ProductCard from '../../components/ui/ProductCard'
import { products } from '../../data/mockData'

export default function CatalogoPage() {
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [priceSort, setPriceSort] = useState('default')

    const filteredProducts = products.filter(product =>
        selectedCategory === 'all' || product.category === selectedCategory
    )

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (priceSort === 'asc') return a.price - b.price
        if (priceSort === 'desc') return b.price - a.price
        return 0
    })

    const categories = ['all', 'Corporativo', 'Térmica', 'Industrial']

    return (
        <div className="max-w-[1280px] mx-auto flex min-h-screen">
            {/* Sidebar Filters */}
            <aside className="hidden md:flex flex-col py-6 gap-4 bg-slate-50 h-auto w-64 border-r border-slate-200 shrink-0">
                <div className="px-6 mb-4">
                    <h2 className="text-[#163C7A] font-bold text-sm uppercase">FILTROS</h2>
                    <p className="text-slate-500 text-[10px] tracking-widest uppercase">LÍNEAS DE PRODUCTO</p>
                </div>

                <nav className="flex flex-col gap-1">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-6 py-3 flex items-center gap-3 text-sm font-semibold uppercase transition-colors ${selectedCategory === cat
                                    ? 'bg-white text-[#163C7A] border-l-4 border-[#FC9430]'
                                    : 'text-slate-500 hover:bg-slate-100'
                                }`}
                        >
                            <span className="material-symbols-outlined">
                                {cat === 'all' ? 'grid_view' : cat === 'Corporativo' ? 'checkroom' : cat === 'Térmica' ? 'local_laundry_service' : 'hide_source'}
                            </span>
                            {cat === 'all' ? 'TODOS' : cat.toUpperCase()}
                        </button>
                    ))}
                </nav>

                <div className="mt-8 px-6">
                    <button className="w-full bg-[#FC9430] text-white py-3 font-bold uppercase tracking-widest hover:bg-[#e0852b] transition-all">
                        Aplicar Filtros
                    </button>
                </div>
            </aside>

            {/* Product Grid */}
            <section className="flex-1 p-6 bg-surface">
                <div className="flex justify-between items-end mb-8 border-b-2 border-surface-container-highest pb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-primary">PRENDAS CON BORDADO PROFESIONAL</h1>
                        <p className="text-on-surface-variant text-sm mt-2">Potenciamos la imagen de tu equipo con prendas que duran</p>
                    </div>
                    <div className="flex gap-4 items-center">
                        <span className="text-xs uppercase text-on-surface-variant">{sortedProducts.length} PRENDAS</span>
                        <select
                            value={priceSort}
                            onChange={(e) => setPriceSort(e.target.value)}
                            className="bg-transparent border-none text-sm font-bold text-primary focus:ring-0 cursor-pointer"
                        >
                            <option value="default">MÁS VENDIDAS</option>
                            <option value="asc">PRECIO: MENOR A MAYOR</option>
                            <option value="desc">PRECIO: MAYOR A MENOR</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </section>
        </div>
    )
}