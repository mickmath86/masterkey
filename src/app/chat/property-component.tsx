import { Card, CardHeader, CardDescription, CardContent } from "@/components/ui/card";
import Image from "next/image";

export default function PropertyComponent({ propertyData }: { propertyData: any }) {
    const address = propertyData.property.address;
    const fullAddress = `${address.streetAddress}, ${address.city}, ${address.state} ${address.zipcode}`;
    const imageUrl = propertyData.property.image;
    console.log(`imageUrl: ${imageUrl}`);
    return (
        console.log(propertyData),
        <Card className="p-4">
            <CardHeader>
            <h2 className="text-xl font-semibold ">{fullAddress}</h2>
            </CardHeader>
            <CardDescription>
                Property details and market information
            </CardDescription>
            <CardContent>
            {imageUrl && (
                <div className="mb-4">
                    <Image 
                        src={imageUrl} 
                        alt={fullAddress} 
                        width={500} 
                        height={300}
                        className="rounded-lg object-cover"
                    />
                </div>
            )}
            
            <div className="grid grid-cols-2 gap-4 text-sm">
                {propertyData.property.price && (
                    <div>
                        <span className="font-medium">Estimated Price:</span> ${propertyData.property.price.toLocaleString()}
                    </div>
                )}
                {propertyData.property.bedrooms && (
                    <div>
                        <span className="font-medium">Bedrooms:</span> {propertyData.property.bedrooms}
                    </div>
                )}
                {propertyData.property.bathrooms && (
                    <div>
                        <span className="font-medium">Bathrooms:</span> {propertyData.property.bathrooms}
                    </div>
                )}
                {propertyData.property.livingArea && (
                    <div>
                        <span className="font-medium">Living Area:</span> {propertyData.property.livingArea} sq ft
                    </div>
                )}
                {propertyData.property.yearBuilt && (
                    <div>
                        <span className="font-medium">Year Built:</span> {propertyData.property.yearBuilt}
                    </div>
                )}
                {propertyData.property.propertyType && (
                    <div>
                        <span className="font-medium">Type:</span> {propertyData.property.propertyType}
                    </div>
                )}
            </div>
            </CardContent>
           
        </Card>
    );
}