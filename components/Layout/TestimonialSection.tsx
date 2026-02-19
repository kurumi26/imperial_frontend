import React, { useEffect, useState } from 'react';

type Testimonial = {
  image: string;
  text: string;
  name: string;
  company: string;
};

const testimonials: Testimonial[] = [
  {
    image: '/images/users/pic1.jfif',
    text: 'Imperial PVC delivered on time and exceeded expectations. Their products are top quality.',
    name: 'Maria Santos',
    company: 'Santos Builders'
  },
  {
    image: '/images/users/pic2.jfif',
    text: 'We rely on Imperial PVC for our projects — consistent and reliable performance.',
    name: 'John Reyes',
    company: 'Reyes Construction'
  },
  {
    image: '/images/users/pic3.jfif',
    text: 'Great customer service and durable products. Highly recommended.',
    name: 'Anna Cruz',
    company: 'Cruz Architects'
  },
  {
    image: '/images/users/user3.jfif',
    text: 'Professional team and excellent materials. Will work with them again.',
    name: 'Peter Ong',
    company: 'Ong Engineering'
  }
];

export default function TestimonialSection() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex(i => (i + 1) % testimonials.length), 4500);
    return () => clearInterval(id);
  }, []);

  const prev = () => setIndex(i => (i - 1 + testimonials.length) % testimonials.length);
  const next = () => setIndex(i => (i + 1) % testimonials.length);

  return (
    <section className="testimonial-root container py-4">
      <div className="heading-block text-center border-0" data-heading="W">
        <h2 className="fs-1 fw-bold">What Our Clients Say</h2>
      </div>

      <div className="testimonial-slider d-flex align-items-center">
        <button aria-label="Previous testimonial" onClick={prev} className="nav-btn">‹</button>

        <div className="testimonial-card mx-3">
          <div className="d-flex flex-column g-0 align-items-center">
            <div className="col-12 col-md-3 text-center">
              <img src={testimonials[index].image} alt={testimonials[index].name} className="avatar img-fluid rounded-circle overflow-hidden" />
            </div>
            <div className="col-12 col-md-9 mt-3 mt-md-0 text-center py-5">
              <p className="text-muted fs-5">“{testimonials[index].text}”</p>
              <p className="mb-0 fw-bold">{testimonials[index].name}</p>
              <small className="text-secondary"><i>{testimonials[index].company}</i></small>
            </div>
          </div>
        </div>

        <button aria-label="Next testimonial" onClick={next} className="nav-btn">›</button>
      </div>

      <div className="d-flex justify-content-center gap-2 mt-4 indicators">
        {testimonials.map((_, i) => (
          <button key={i} onClick={() => setIndex(i)} className={`dot ${i === index ? 'active' : ''}`} aria-label={`Go to testimonial ${i+1}`}></button>
        ))}
      </div>

      <style jsx>{`
        .testimonial-root { max-width: 1100px; }
        .testimonial-slider { gap: 16px; }
        .nav-btn { background: rgba(0, 0, 0, 0%); color: #414141; border: none; cursor: pointer; font-size: 52px; }
        .testimonial-card { background: #fff; border-radius: 8px; padding: 18px; width:100%; }
        .avatar { width: 120px; height: 120px; object-fit: cover; border-radius: 8px; }
        .dot { width:12px; height:12px; border-radius:50%; background:#e6e6e6; border:none; cursor:pointer; }
        .dot.active { background:#ff7b00; }
        @media(max-width:768px) {
          .testimonial-slider { flex-direction: column; }
          .nav-btn { align-self: center; }
          .avatar { width:90px; height:90px; }
        }
      `}</style>
    </section>
  );
}
