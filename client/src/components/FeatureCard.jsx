export default function FeatureCard({ title, description }) {
    return (
        <div className="bg-white shadow rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-gray-600">{description}</p>
        </div>
    );
}
