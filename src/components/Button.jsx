import React from 'react'

const Button = ({ title, id, rightIcon, leftIcon, containerClass }) => {
    return (
        <button
            id={id}
            className={`
                group relative z-10 w-fit cursor-pointer overflow-hidden 
                rounded-full px-7 py-3 
                bg-violet-50 text-black 
                flex items-center gap-2
                font-general font-semibold text-sm
                transition-all duration-300 ease-out
                hover:scale-105 hover:bg-violet-200
                ${containerClass}
            `}
        >
            {leftIcon && (
                <span className="text-black text-lg flex items-center transition-all duration-300">
                    {leftIcon}
                </span>
            )}

            <span className="relative text-black font-semibold uppercase tracking-wide transition-all duration-300">
                {title}
            </span>

            {rightIcon && (
                <span className="text-black text-lg flex items-center transition-all duration-300">
                    {rightIcon}
                </span>
            )}
        </button>
    )
}

export default Button
