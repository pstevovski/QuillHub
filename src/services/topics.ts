import handleErrorMessage from "@/utils/handleErrorMessage";
import db from "@/db/connection";
import { schemaTopics } from "@/db/schema/topics";
import { eq, inArray } from "drizzle-orm";
import TokenService from "./token";

enum UserRoles {
  BASIC = 1,
  ADMIN = 2,
}

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

  async create(userId: number, name: string) {
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

  async update(id: number, name: string) {
    try {
      const tokenDetails = await TokenService.decodeToken();
      const userID = tokenDetails?.id || 0;
      const roleID = tokenDetails?.role_id || 1;

      // Find the targeted topic
      const targetedTopic = await db
        .select()
        .from(schemaTopics)
        .where(eq(schemaTopics.id, id));

      if (!targetedTopic[0]) return null;

      // Only allow the user that created the topic (or an admin) to update it
      if (
        targetedTopic[0].created_by !== userID ||
        roleID !== UserRoles.ADMIN
      ) {
        throw new Error("Unauthorized to update this topic!");
      }

      // Update the name of the topic
      await db
        .update(schemaTopics)
        .set({ name })
        .where(eq(schemaTopics.id, id));
      console.log(`Successfully updated the name of topic with ID ${id}.`);
    } catch (error) {
      console.log(
        `Failed updating topic with ID ${id}: ${handleErrorMessage(error)}`
      );
      throw new Error(handleErrorMessage(error));
    }
  }

  /**
   *
   * Delete the specifically targeted topic
   *
   * @param id The ID of the topic saved in the database
   *
   */
  async deleteSpecific(id: number) {
    try {
      await db.delete(schemaTopics).where(eq(schemaTopics.id, id));
      console.log(`Topic with id: ${id} was successfully deleted!`);
    } catch (error) {
      console.log("Failed deleting topic: ", handleErrorMessage(error));
      throw new Error("Failed deleting topic!");
    }
  }

  /**
   *
   * Delete multiple selected topics at once
   *
   * @param ids The IDs of the topics that were selected for deletion
   *
   */
  async deleteBulk(ids: number[]) {
    try {
      await db.delete(schemaTopics).where(inArray(schemaTopics.id, ids));
      console.log(`Successfully removed ${ids.length} topics!`);
    } catch (error) {
      console.log("Failed bulk topics deletion: ", handleErrorMessage(error));
      throw new Error("Failed bulk topics deletion!");
    }
  }
}

const TopicsService = new Topics();

export default TopicsService;
