import handleErrorMessage from "@/utils/handleErrorMessage";
import db from "@/db/connection";
import { schemaTopics } from "@/db/schema/topics";
import { eq } from "drizzle-orm";

class Topics {
  private generateUniqueTopicSlug(name: string): string {
    return name.split(" ").join("-").toLowerCase();
  }

  async getAll() {
    try {
      const topics = await db.select().from(schemaTopics);
      return topics;
    } catch (error) {
      console.log(`Failed getting topics: ${handleErrorMessage(error)}`);
      throw new Error("Failed getting topics");
    }
  }

  async getSpecifc(id: number) {
    try {
      const targetedTopic = await db
        .select()
        .from(schemaTopics)
        .where(eq(schemaTopics.id, id));

      return targetedTopic[0];
    } catch (error) {
      console.log(
        `Failed getting topic with id ${id}: ${handleErrorMessage(error)}`
      );
      throw new Error("Failed getting the targeted topic");
    }
  }

  async createTopic(userId: number, name: string) {
    try {
      await db.insert(schemaTopics).values({
        name,
        slug: this.generateUniqueTopicSlug(name),
        created_by: userId,
      });

      console.log("Topic created successfully!");
    } catch (error) {
      console.log(`Failed creating topic: ${handleErrorMessage(error)}`);
      throw new Error("Failed creating topic");
    }
  }
}

const TopicsService = new Topics();

export default TopicsService;
