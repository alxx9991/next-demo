import MeetupDetail from "../../components/meetups/MeetUpDetail";
import { MongoClient, ObjectId } from "mongodb";

function MeetupDetails(props) {
  return <MeetupDetail {...props.meetUpData}></MeetupDetail>;
}

export async function getStaticProps(context) {
  const meetupId = context.params.meetupID;

  const client = await MongoClient.connect(
    "mongodb+srv://alex:alex@cluster0.7b9z4.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetup = await meetupsCollection.findOne({ _id: ObjectId(meetupId) });

  const { _id, image, title, address, description } = meetup;

  client.close();

  return {
    props: {
      meetUpData: {
        id: _id.toString(),
        image,
        title,
        address,
        description,
      },
    },
  };
}

export async function getStaticPaths() {
  const client = await MongoClient.connect(
    "mongodb+srv://alex:alex@cluster0.7b9z4.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

  const paths = meetups.map((meetup) => {
    return {
      params: { meetupID: meetup._id.toString() },
    };
  });

  client.close();

  return {
    fallback: "blocking",
    paths,
  };
}

export default MeetupDetails;
