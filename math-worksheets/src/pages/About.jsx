import { Link } from 'react-router-dom';
import Seo from '@/components/Seo.jsx';

export default function AboutPage() {
  return (
    <>
      <Seo
        title="About Bhav"
        description="Bhav Khurana has a B.A. in Mathematics and Statistics from Reed College and has run 600+ one-on-one tutoring sessions. Here's why he tutors and how he teaches."
        keywords={['about bhav khurana', 'math tutor bio', 'Reed College math tutor']}
        structuredData={({ canonicalUrl }) => ({
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          name: 'About Bhav Khurana',
          url: canonicalUrl,
        })}
      />

      <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="animate-fade-in-up rounded-xl border border-gray-200 bg-white p-8 sm:p-10">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-brand-primary-dark sm:text-4xl">Why I tutor</h1>
            <div className="mx-auto mt-4 h-0.5 w-16 rounded-full bg-gradient-to-r from-brand-secondary to-brand-secondary-dark" />
          </div>

          <div className="mt-8 space-y-5 text-brand-neutral">
            <p>
              I have a B.A. in Mathematics and Statistics from Reed College (2023). Since then I've spent
              years explaining the same ideas: slope, standard deviation, the chain rule, from as many
              angles as it takes until one of them lands.
            </p>

            <p>
              Between October 2023 and March 2025 I ran more than 600 one-on-one sessions for Pear Deck
              Tutor, working with students from elementary school through college, and I designed the
              introductory statistics and probability curriculum they used for non-traditional learners.
              Since May 2024 I've tutored independently, and I currently coach 7 students every week.
            </p>

            <p>
              Six hundred sessions taught me that almost nobody is missing practice problems. Most
              students are missing the one explanation, phrased the right way, that makes everything
              after it click. That's what I actually spend my time hunting for.
            </p>

            <p>
              A lot of the time, that explanation isn't even about the topic we're stuck on. A student
              struggling with related rates is often actually missing a fraction rule from three years
              earlier that never fully clicked. Find that gap, and the calculus takes care of itself.
            </p>
          </div>

          <div className="mt-6 rounded-lg bg-brand-cream/50 p-4">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-brand-primary-dark">
              How I teach
            </p>
            <ul className="list-disc space-y-2 pl-5 text-brand-neutral">
              <li>
                <strong>Start from where a student actually is</strong>, even if that means backing up
                further than the topic on the page.
              </li>
              <li>
                <strong>Build understanding before speed.</strong> The shortcuts come later, once the
                concept is solid.
              </li>
              <li>
                <strong>Practice on real problems.</strong> It's part of why I built the SAT Math
                practice bank on this site myself.
              </li>
            </ul>
          </div>

          <p className="mt-6 font-semibold text-brand-primary-dark">
            Feel free to email me first with any questions, happy to talk before you book.
          </p>
          <p className="mt-2 text-right text-brand-neutral">- Bhav Khurana</p>

          <p className="mt-4 border-t border-gray-100 pt-4 text-center text-sm text-gray-500">
            Reach me at{' '}
            <a
              href="mailto:bhavjotskhurana@gmail.com"
              className="font-medium text-brand-primary hover:underline"
            >
              bhavjotskhurana@gmail.com
            </a>
            , or{' '}
            <Link to="/book" className="font-medium text-brand-primary hover:underline">
              book a session directly
            </Link>
            .
          </p>
        </div>
      </div>
    </>
  );
}
