import React from 'react'

const Breadcrumbs = ({subject, topic,solvedBy}) => {
  return (
    <div className='w-[100vw]'>
      <nav aria-label="Breadcrumb">
  <ol className="flex items-center w-[100vw] justify-center gap-1 text-sm text-white dark:text-gray-200">
    <li>
      <a href="#" className="block transition-colors hover:text-gray-900 dark:hover:text-white">
        {subject}
      </a>
    </li>

    <li className="rtl:rotate-180">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="size-4"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
          clipRule="evenodd"
        />
      </svg>
    </li>

    <li>
      <a href="#" className="block transition-colors hover:text-gray-900 dark:hover:text-white">
        {topic}
      </a>
    </li>

    <li className="rtl:rotate-180">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="size-4"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
          clipRule="evenodd"
        />
      </svg>
    </li>

    <li>
      <a href="#" className="block transition-colors hover:text-gray-900 dark:hover:text-white">
        Solved by {solvedBy} others.
      </a>
    </li>
  </ol>
</nav>
    </div>
  )
}

export default Breadcrumbs
