interface Major {
    name: string;
    videoEmbedUrl: string;
};

export const majorsInfo: Major[] = [
    {
        name: "Computer Science",
        videoEmbedUrl: "https://www.youtube.com/embed/Nrrz92sU314",
    }
];

export const majors = majorsInfo.map(major => major.name);

export function isValidMajor(major: string): boolean {
    return majors.includes(major);
}

export function getMajorVideo(majorName: string): string {
    const major = majorsInfo.find(major => major.name === majorName);

    if (!major) {
        throw new Error(`Major ${majorName} not found`);
    }

    return major.videoEmbedUrl;
}
