// import React, { useState } from 'react';
// import axios from 'axios';

// export default function RainfallPredictionApp() {
//     const [formData, setFormData] = useState({
//         pressure: '',
//         dewPoint: '',
//         humidity: '',
//         cloud: '',
//         sunshine: '',
//         windDirection: '',
//         windSpeed: ''
//     });

//     const [prediction, setPrediction] = useState(null);
//     const [percentage, setPercentage] = useState(null);
//     const [error, setError] = useState('');

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({ ...prev, [name]: value }));
//     };

//     const validateInputs = () => {
//         const { pressure, dewPoint, humidity, cloud, sunshine, windDirection, windSpeed } = formData;
//         if (isNaN(parseFloat(pressure))) return 'Pressure must be a float';
//         if (isNaN(parseFloat(dewPoint))) return 'Dew Point must be a number';
//         if (!Number.isInteger(Number(humidity))) return 'Humidity must be an integer';
//         if (!Number.isInteger(Number(cloud))) return 'Cloud must be an integer';
//         if (isNaN(parseFloat(sunshine))) return 'Sunshine must be a number';
//         if (isNaN(parseFloat(windDirection))) return 'Wind Direction must be a float';
//         if (isNaN(parseFloat(windSpeed))) return 'Wind Speed must be a float';
//         return null;
//     };

//     const handleSubmit = async () => {
//         const validationError = validateInputs();
//         if (validationError) {
//             setError(validationError);
//             return;
//         }
//         setError('');
//         try {
//             const response = await axios.post('http://localhost:5000/predict', {
//                 pressure: parseFloat(formData.pressure),
//                 dewPoint: parseFloat(formData.dewPoint),
//                 humidity: parseInt(formData.humidity),
//                 cloud: parseInt(formData.cloud),
//                 sunshine: parseFloat(formData.sunshine),
//                 windDirection: parseFloat(formData.windDirection),
//                 windSpeed: parseFloat(formData.windSpeed)
//             });
//             setPrediction(response.data.rain_expectation);
//             setPercentage(response.data.percentage);
//         } catch (err) {
//             setError('Failed to get prediction from the server.');
//         }
//     };

//     return (
//         <div style={{ maxWidth: '500px', margin: '40px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '10px', backgroundColor: '#f9f9f9' }}>
//             <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Rainfall Prediction</h1>
//             {['pressure', 'dewPoint', 'humidity', 'cloud', 'sunshine', 'windDirection', 'windSpeed'].map(field => (
//                 <div key={field} style={{ marginBottom: '15px' }}>
//                     <label style={{ display: 'block', marginBottom: '5px', textTransform: 'capitalize' }}>{field.replace(/([A-Z])/g, ' $1')}</label>
//                     <input
//                         type="text"
//                         name={field}
//                         value={formData[field]}
//                         onChange={handleChange}
//                         style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
//                         placeholder={`Enter ${field}`}
//                     />
//                 </div>
//             ))}
//             {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}
//             <button
//                 onClick={handleSubmit}
//                 style={{ backgroundColor: '#007bff', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
//             >
//                 Predict
//             </button>
//             {prediction && (
//                 <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#d4edda', border: '1px solid #c3e6cb', borderRadius: '5px' }}>
//                     <strong>Prediction:</strong> {prediction} <br />
//                     <strong>Confidence:</strong> {percentage}%
//                 </div>
//             )}
//         </div>
//     );
// }





import React, { useState } from 'react';
import axios from 'axios';
import { Cloud, CloudRain, Droplets, Wind, Compass, Sun, Gauge } from 'lucide-react';

export default function RainfallPredictionApp() {
    const [formData, setFormData] = useState({
        pressure: '',
        dewPoint: '',
        humidity: '',
        cloud: '',
        sunshine: '',
        windDirection: '',
        windSpeed: ''
    });

    const [prediction, setPrediction] = useState(null);
    const [percentage, setPercentage] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const fieldConfig = {
        pressure: { icon: Gauge, hint: 'Typical range: 970-1040 hPa' },
        dewPoint: { icon: Droplets, hint: 'Typical range: 0-25°C' },
        humidity: { icon: Cloud, hint: 'Range: 0-100%' },
        cloud: { icon: Cloud, hint: 'Range: 0-100%' },
        sunshine: { icon: Sun, hint: 'Range: 0-24 hours' },
        windDirection: { icon: Compass, hint: 'Range: 0-360°' },
        windSpeed: { icon: Wind, hint: 'Typical range: 0-100 km/h' }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const validateInputs = () => {
        const { pressure, dewPoint, humidity, cloud, sunshine, windDirection, windSpeed } = formData;
        if (isNaN(parseFloat(pressure))) return 'Pressure must be a float';
        if (isNaN(parseFloat(dewPoint))) return 'Dew Point must be a number';
        if (!Number.isInteger(Number(humidity))) return 'Humidity must be an integer';
        if (!Number.isInteger(Number(cloud))) return 'Cloud must be an integer';
        if (isNaN(parseFloat(sunshine))) return 'Sunshine must be a number';
        if (isNaN(parseFloat(windDirection))) return 'Wind Direction must be a float';
        if (isNaN(parseFloat(windSpeed))) return 'Wind Speed must be a float';
        return null;
    };

    const handleSubmit = async () => {
        const validationError = validateInputs();
        if (validationError) {
            setError(validationError);
            return;
        }
        setError('');
        setIsLoading(true);

        try {
            const response = await axios.post('http://localhost:5000/predict', {
                pressure: parseFloat(formData.pressure),
                dewPoint: parseFloat(formData.dewPoint),
                humidity: parseInt(formData.humidity),
                cloud: parseInt(formData.cloud),
                sunshine: parseFloat(formData.sunshine),
                windDirection: parseFloat(formData.windDirection),
                windSpeed: parseFloat(formData.windSpeed)
            });
            setPrediction(response.data.rain_expectation);
            setPercentage(response.data.percentage);
        } catch (err) {
            setError('Failed to get prediction from the server.');
        } finally {
            setIsLoading(false);
        }
    };

    const getConfidenceColor = (percentage) => {
        if (percentage >= 80) return 'bg-emerald-100 border-emerald-300 text-emerald-800';
        if (percentage >= 60) return 'bg-blue-100 border-blue-300 text-blue-800';
        if (percentage >= 40) return 'bg-yellow-100 border-yellow-300 text-yellow-800';
        return 'bg-red-100 border-red-300 text-red-800';
    };

    const resetForm = () => {
        setPrediction(null);
        setPercentage(null);
        setFormData({
            pressure: '',
            dewPoint: '',
            humidity: '',
            cloud: '',
            sunshine: '',
            windDirection: '',
            windSpeed: ''
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm bg-white/90">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                            <CloudRain className="w-8 h-8 text-blue-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800">Rainfall Prediction</h1>
                        <p className="text-gray-600 mt-2">Enter weather parameters to predict rainfall</p>
                    </div>

                    {!prediction ? (
                        <div className="space-y-6">
                            {Object.entries(formData).map(([field, value]) => {
                                const Icon = fieldConfig[field].icon;
                                return (
                                    <div key={field} className="relative group">
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            {field.replace(/([A-Z])/g, ' $1').trim()}
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Icon className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                name={field}
                                                value={value}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                                placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                                            />
                                        </div>
                                        {fieldConfig[field].hint && (
                                            <p className="mt-1 text-xs text-gray-500">{fieldConfig[field].hint}</p>
                                        )}
                                    </div>
                                );
                            })}

                            {error && (
                                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm animate-shake">
                                    {error}
                                </div>
                            )}

                            <button
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className={`w-full py-3 px-4 rounded-lg font-medium text-white 
                                    ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'} 
                                    transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0
                                    flex items-center justify-center`}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                        Processing...
                                    </>
                                ) : (
                                    'Predict Rainfall'
                                )}
                            </button>
                        </div>
                    ) : (
                        <div className="animate-fadeIn">
                            <div className={`p-6 rounded-lg border ${getConfidenceColor(percentage)} mb-6`}>
                                <div className="flex items-start">
                                    <div className="mr-4">
                                        {prediction.toLowerCase().includes('yes') ? (
                                            <CloudRain className="w-8 h-8 text-blue-600" />
                                        ) : (
                                            <Sun className="w-8 h-8 text-yellow-500" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg mb-1">Prediction Result</h3>
                                        <p className="text-lg mb-4">{prediction}</p>

                                        <div className="mb-2 flex justify-between">
                                            <span className="text-sm font-medium">Confidence</span>
                                            <span className="text-sm font-medium">{percentage}%</span>
                                        </div>

                                        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                                            <div
                                                className={`h-2.5 rounded-full transition-all duration-1000 ease-out ${prediction.toLowerCase().includes('yes') ? 'bg-blue-600' : 'bg-yellow-500'
                                                    }`}
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={resetForm}
                                className="w-full py-2.5 px-4 border border-gray-300 rounded-lg text-gray-700 
                                    hover:bg-gray-50 transition-colors duration-200 font-medium
                                    flex items-center justify-center gap-2"
                            >
                                <Cloud className="w-4 h-4" />
                                Make Another Prediction
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}