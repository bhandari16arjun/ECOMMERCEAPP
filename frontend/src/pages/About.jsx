import { assets } from "../assets/assets";
import NewsletterBox from "../components/NewsletterBox";
import Title from "../components/Title";

export default function About(){
    return(
        <div>
            <div className="text-2xl text-center pt-8 border-t">
                 <Title text1={'ABOUT'} text2={'US'} />
            </div>
            <div className="my-10 flex flex-col md:flex-row gap-16">
                 <img className="w-full md:max-w-[450px]" src={assets.about_img} alt="" />
                 <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
                     <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem odio veritatis iusto tempora necessitatibus? Non pariatur laudantium optio, autem animi veniam aperiam amet. Ea incidunt vel pariatur itaque delectus eveniet!</p>
                     <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Porro doloribus autem quidem veniam neque, repellat dignissimos commodi fugit odit optio rerum voluptas alias harum nesciunt natus odio nihil voluptatibus veritatis?</p>
                     <b className="text-gray-800">Our Mission</b>
                     <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem eius saepe reiciendis id, asperiores similique reprehenderit laboriosam quaerat, earum accusantium repellat impedit deserunt? Delectus molestiae veritatis distinctio soluta vero adipisci!</p>
                 </div>
            </div>
            <div className="text-xl py-4">
                <Title text1={'WHY'} text2={'CHOOSE US'} />
            </div>
            <div className="flex flex-col md:flex-row text-sm mb-20">
               <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
                  <b>Quality Assurance:</b>
                  <p className="text-gray-600">We meticulously select and vet each product to ensure it meets our stringent quality standards.</p>
               </div>
               <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
                  <b>Convenience:</b>
                  <p className="text-gray-600">With our user-friendly interface and hassle-free ordering process,shopping has never been.</p>
               </div>
               <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
                  <b>Exceptional Customer Service:</b>
                  <p className="text-gray-600">Our team of dedicated professionals is here to assist you the way, ensuring your satisfaction is our priority.</p>
               </div>
            </div>
            <NewsletterBox />
        </div>
    )
}