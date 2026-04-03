export default function Contact() {
  return (
    <div className="max-w-xl mx-auto px-8 py-16">
      <h1 className="text-2xl font-semibold mb-8">Contact</h1>
      <form className="space-y-5">
        <div>
          <label className="block text-sm mb-1">Name</label>
          <input
            type="text"
            className="w-full border border-gray-300 px-3 py-2 text-sm rounded focus:outline-none focus:border-black transition-colors"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            className="w-full border border-gray-300 px-3 py-2 text-sm rounded focus:outline-none focus:border-black transition-colors"
            placeholder="your@email.com"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Subject</label>
          <select className="w-full border border-gray-300 px-3 py-2 text-sm rounded focus:outline-none focus:border-black transition-colors bg-black text-white">
            <option value="">Select a subject</option>
            <option value="commission">Commission inquiry</option>
            <option value="commercial">Commercial use</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Message</label>
          <textarea
            rows={5}
            className="w-full border border-gray-300 px-3 py-2 text-sm rounded focus:outline-none focus:border-black transition-colors"
            placeholder="Tell me about your project..."
          />
        </div>
        <button
          type="submit"
          className="w-full bg-black text-white py-2 text-sm rounded hover:bg-gray-800 transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
}
