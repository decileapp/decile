// Remove { Dict, Query } if not using TypeScript
import mixpanel from "mixpanel-browser";

mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_KEY || "", {
  // Use your project's URL, adding a slug for all Mixpanel requests
  api_host: process.env.NEXT_PUBLIC_ORIGIN,
  debug: true,
});

export const event = (event_name: string, props: any) => {
  try {
    if ((window as any).mixpanel) {
      (window as any).mixpanel.track(event_name, props);
    }
  } catch (e) {
    console.log(e);
  }
};
