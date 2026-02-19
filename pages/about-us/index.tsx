import React, { useEffect, useState } from "react";
import Header from "@/components/Layout/_Header";
import GlobalFooter from '@/components/Layout/GlobalFooter';

export default function AboutUs() {

    return (
        
        <div>
            <Header />

            <div className="header-bar bg-black" style={{minHeight: "100px"}}></div>

            <div className="d-flex text-center flex-column align-items-center py-5">
                <div className="container">
                    <div className="heading-block text-center border-0 cutter-title" data-heading="A">
                        <h2 className="fs-1 fw-bold">About Us</h2>
                        <small className="fs-5 fw-light text-secondary">
                            Our Projects showcase the strength, precision, and reliability behind every PVC pipe solution we deliver. 
                            From residential plumbing to large-scale commercial systems, we build durable connections that stand the test of time.
                        </small>
                    </div>
                </div>
            </div>

            <div className="w-100">
                <img src="/images/roofing1.jpg" alt="" />
                <GlobalFooter />
            </div>
        </div>

    );
}