import React from 'react'

const card = () => {
    return (
        <div className='w-screen cursor-pointer lg:w-[40vw] hidden border-2 rounded-3xl px-10 py-2 lg:flex'>
            <article className="overflow-hidden flex flex-col justify-center items-center  rounded-lg shadow-sm transition hover:shadow-lg">
                <img
                    alt=""
                    src="https://plus.unsplash.com/premium_vector-1734709211749-d35b78b79415?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    className="h-[30vh] w-1/2 object-cover"
                />

                <div className="bg-white p-4 sm:p-6">
                    <time className="block text-xs text-gray-500"> 10th Oct 2022 </time>

                    <a href="#">
                        <h3 className="mt-0.5 text-lg text-gray-900">How to position your furniture for positivity</h3>
                    </a>

                    <p className="mt-2 line-clamp-3 text-sm/relaxed text-gray-500">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae dolores, possimus
                        pariatur animi temporibus nesciunt praesentium dolore sed nulla ipsum eveniet corporis quidem,
                        mollitia itaque minus soluta, voluptates neque explicabo tempora nisi culpa eius atque
                        dignissimos. Molestias explicabo corporis voluptatem?
                    </p>
                </div>
            </article>
        </div>
    )
}

export default card
