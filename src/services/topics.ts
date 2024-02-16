import handleErrorMessage from "@/utils/handleErrorMessage";
import TokenService from "./token";
import db from "@/db/connection";
import { schemaTopics } from "@/db/schema/topics";
import { eq } from "drizzle-orm";

class Topics {
  private generateUniqueTopicSlug(name: string): string {
    return name.split(" ").join("-").toLowerCase();
  }

  async createTopic(name: string) {
    try {
      // Get the ID of the logged in user
      // Todo: This will become repetitive; extract functionality?
      const userToken = await TokenService.decodeToken();
      if (!userToken) throw new Error("Unauthenticated!");

      await db.insert(schemaTopics).values({
        name,
        slug: this.generateUniqueTopicSlug(name),
        created_by: userToken.id as number,
      });

      console.log("Topic created successfully!");
    } catch (error) {
      console.log(`Failed creating topic: ${handleErrorMessage(error)}`);
      throw new Error("Failed creating topic");
    }
  }

  async getSpecifc(id: number) {
    try {
      const targetedTopic = await db
        .select()
        .from(schemaTopics)
        .where(eq(schemaTopics.id, id));

      if (!targetedTopic || !targetedTopic[0]) {
        throw new Error("Topic does not exist!");
      }

      return targetedTopic[0];
    } catch (error) {
      console.log(
        `Failed getting topic with id ${id}: ${handleErrorMessage(error)}`
      );
      throw new Error("Failed getting the targeted topic");
    }
  }
}

const TopicsService = new Topics();

export default TopicsService;
