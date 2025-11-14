import Seo from '@/components/Seo.jsx';
import './About.css';

export default function AboutPage() {
  return (
    <>
      <Seo
        title="About Scotch Egg Math Worksheets"
        description="Learn why Scotch Egg creates free, high-quality SAT math worksheets with thoughtful practice structures and how the collection is expanding."
        keywords={[
          'about scotch egg',
          'math worksheet creator',
          'free SAT math resources',
          'teacher made worksheets',
        ]}
        structuredData={({ canonicalUrl }) => ({
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          name: 'About Scotch Egg Math Worksheets',
          url: canonicalUrl,
          description:
            'Scotch Egg shares how the free SAT math worksheet collection started, who it serves, and what resources are coming next for students and tutors.',
        })}
      />
      <div className="about-page">
        <section className="about-wrapper">
          <div className="about-letter">
            <header className="about-letter__header">
              <p className="about-letter__eyebrow">From the desk of Scotch Egg</p>
              <h1>Why these worksheets exist</h1>
              <div className="about-letter__divider" />
            </header>

          <p>
            Dear students, teachers, and tireless tutors, Scotch Egg is my small commitment to making rigorous SAT math
            prep feel warm, clear, and free. Every worksheet in Units 1 through 3 started as a lesson I needed in my own
            classroom: concept summaries, thoughtful examples, deep practice, and reflection prompts so learners can
            slow down and notice the progress they are making.
          </p>

          <p>
            This library exists because strong materials should not hide behind paywalls. I want any student with a
            printer (or a tablet) to download a full lesson, see exactly what a question is asking, and feel brave
            enough to try again. When you press download, you are getting everything I would hand to my own students.
          </p>

          <div className="about-letter__focus">
            <p className="about-letter__focus-title">Where we are headed</p>
            <ul>
              <li>
                <strong>New worksheets every month.</strong> Units 4 through 10 are in development with the same
                structure, reflection pages, and clean typography.
              </li>
              <li>
                <strong>Topic boosters and mini-quizzes.</strong> Shorter, single-page drills for speed work plus timed
                practice sets to build stamina.
              </li>
              <li>
                <strong>Student-first products.</strong> Printable planners, checklists, and eventually a lightweight
                practice app so students can track mastery topic by topic.
              </li>
            </ul>
          </div>

          <p>
            I am building this in public. If you spot an error, want a new topic, or just want to celebrate a win, send
            a note. Every improvement comes from conversations with students and educators who care as much as you do.
          </p>

          <p className="about-letter__thankyou">
            Thank you for being here and for sharing Scotch Egg with the students who need it most.
          </p>
          
          <p className="about-letter__contact">
            For any questions or concerns please reach out to <a href="mailto:hello@scotchegg.co">hello@scotchegg.co</a>.
          </p>
          </div>
        </section>
      </div>
    </>
  );
}
