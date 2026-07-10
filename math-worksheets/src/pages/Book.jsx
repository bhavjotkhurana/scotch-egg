import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import Seo from '@/components/Seo.jsx';

const CALENDLY_URL = 'https://calendly.com/bhavkhurana/introductory-call';
const MAILTO =
  'mailto:bhavjotskhurana@gmail.com?subject=Tutoring%20inquiry&body=Student%27s%20grade%2Flevel%3A%0ASubject(s)%3A%0AGoals%3A%0AGeneral%20availability%3A';

const SUBJECTS = [
  {
    title: 'SAT / ACT Math',
    description: 'Content review and test-taking strategy across algebra, geometry, and data analysis.',
  },
  {
    title: 'AP Calculus & AP Physics',
    description:
      'AB/BC calculus and algebra-based physics: problem sets, exam strategy, and real conceptual understanding instead of formula memorization.',
  },
  {
    title: 'College-Level Statistics',
    description:
      'Intro statistics and probability, from descriptive stats through hypothesis testing. I designed the non-traditional-learner statistics curriculum Pear Deck used.',
  },
  {
    title: 'K-12 Math',
    description:
      "General math support from elementary through middle school. I've tutored this range since 2023 alongside test-prep and AP work, so foundational skills and exam prep aren't separate specialties for me.",
  },
];

function BookingButtons() {
  return (
    <div className="flex flex-col items-center gap-3">
      <a
        href={CALENDLY_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-8 py-3 font-medium text-white hover:bg-brand-primary-dark"
      >
        <Calendar className="h-4 w-4" /> Book on Calendly
      </a>
      <a href={MAILTO} className="text-sm text-gray-500 hover:text-brand-primary hover:underline">
        Prefer to email first? bhavjotskhurana@gmail.com
      </a>
    </div>
  );
}

export default function Book() {
  return (
    <>
      <Seo
        title="Book a Session"
        description="Book private SAT/ACT Math, AP Calculus & Physics, College Statistics, or K-12 Math tutoring with Bhav Khurana."
      />

      <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-brand-neutral">Let's find a time that works.</h1>
        <p className="mt-3 text-gray-600">
          Book a time directly on my calendar, or email me first if you have questions.
        </p>
        <div className="mt-6">
          <BookingButtons />
        </div>

        <div className="mt-14 text-left">
          <h2 className="text-xl font-bold text-brand-neutral">What I tutor</h2>
          <div className="mt-4 flex flex-col gap-4">
            {SUBJECTS.map((subject) => (
              <div key={subject.title} className="rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="font-semibold text-brand-neutral">{subject.title}</h3>
                <p className="mt-2 text-gray-600">{subject.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 text-left">
          <h2 className="text-xl font-bold text-brand-neutral">Results</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <p className="text-lg font-bold text-brand-neutral">580 → 730</p>
              <p className="mt-1 text-xs text-gray-500">SAT Math, in three months</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <p className="text-lg font-bold text-brand-neutral">600+</p>
              <p className="mt-1 text-xs text-gray-500">sessions delivered, Oct 2023 – Mar 2025</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <p className="text-lg font-bold text-brand-neutral">7</p>
              <p className="mt-1 text-xs text-gray-500">students coached every week</p>
            </div>
          </div>
          <p className="mt-4 text-gray-600">Testimonials from current students are coming soon.</p>
          <p className="mt-2 text-sm text-gray-400">
            I also wrote every question in the{' '}
            <Link to="/" className="underline hover:text-brand-primary">
              practice bank
            </Link>{' '}
            on this site myself.
          </p>
        </div>

        <div className="mt-14 rounded-xl border border-gray-200 bg-white p-6 text-left">
          <p className="font-medium text-brand-neutral">If you'd rather email first, include:</p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-gray-600">
            <li>Student's grade level (or "college")</li>
            <li>Subject(s): SAT/ACT Math, AP Calc/Physics, College Stats, or K-12 Math</li>
            <li>What you're hoping to get out of tutoring</li>
            <li>General availability (days/times)</li>
          </ul>
        </div>

        <div className="mt-8">
          <BookingButtons />
        </div>
      </div>
    </>
  );
}
