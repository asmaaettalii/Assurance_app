import axios from 'axios';

// ⚠️ TEMPORARY FIX: Hardcoded key to bypass .env issues
const PINATA_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJmNTM1OGY1OC0wMDljLTRmM2YtOTVkNC01MTNiZmZmNWUzM2UiLCJlbWFpbCI6ImFzbWFhZXR0YWxpaUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiYWUxZmZiNTM4MzFhZDQ1YzMzOTEiLCJzY29wZWRLZXlTZWNyZXQiOiI0MzdkOTE2NWI2NjBlMjc2NjY4MGEzZDhiNGJiMzU2NGYyMWU2NTRkNmY4OTI2ZWYwODI5OWRkZDE1MGRkNmZjIiwiZXhwIjoxNzk4OTczNTM2fQ.xWuWAPk8TZFSjIuanAc-DsquYTe-AS9od4aYQT2xoGA";

export const uploadToIPFS = async (file) => {
    // console.log("Debug IPFS - Raw JWT:", PINATA_JWT);

    if (!PINATA_JWT || PINATA_JWT.includes('PASTE_YOUR')) {
        throw new Error("Please paste your Pinata JWT directly in src/utils/ipfs.js line 2");
    }

    const formData = new FormData();
    formData.append('file', file);

    const metadata = JSON.stringify({
        name: `claim-proof-${Date.now()}`,
    });
    formData.append('pinataMetadata', metadata);

    const options = JSON.stringify({
        cidVersion: 0,
    });
    formData.append('pinataOptions', options);

    try {
        const res = await axios.post(
            "https://api.pinata.cloud/pinning/pinFileToIPFS",
            formData,
            {
                maxBodyLength: "Infinity",
                headers: {
                    'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                    Authorization: `Bearer ${PINATA_JWT}`,
                },
            }
        );
        console.log("File uploaded to IPFS:", res.data);
        return res.data.IpfsHash;
    } catch (error) {
        console.error("Error uploading to IPFS:", error);
        throw error;
    }
};