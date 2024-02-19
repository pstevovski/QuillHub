import handleErrorMessage from "@/utils/handleErrorMessage";
import db from "@/db/connection";
import { schemaTopics } from "@/db/schema/topics";
import { eq, inArray } from "drizzle-orm";
import TokenService from "./token";
import { ApiErrorMessage } from "@/app/api/handleApiError";

// TODO: To be moved out of here
enum UserRoles {
  BASIC = 1,
  ADMIN = 2,
}

class Topics {
  /** Construct a slug based on the name of the topic */
  private generateUniqueTopicSlug(name: string): string {
    return name.split(" ").join("-").toLowerCase();
  }

  /** Get a list of all existing topics in the system */
  async getAll() {
    try {
      const topics = await db.select().from(schemaTopics);
      return topics;
    } catch (error) {
      console.log(
        `TOPICS - Failed getting existing topics: ${handleErrorMessage(error)}`
      );
      throw new Error(handleErrorMessage(error));
    }
  }

  /**
   *
   * Get a specifically targeted topic
   *
   * @param id The ID of the topic
   * @returns The targeted topic (if it exists) or throws an error
   *
   */
  async getSpecifc(id: number) {
    try {
      const targetedTopic = await db
        .select()
        .from(schemaTopics)
        .where(eq(schemaTopics.id, id));

      // Error out if topic cannot be found
      if (!targetedTopic[0]) throw new Error(ApiErrorMessage.NOT_FOUND);

      return targetedTopic[0];
    } catch (error) {
      console.log(
        `TOPICS - Failed getting topic with ID ${id}: ${handleErrorMessage(
          error
        )}`
      );
      throw new Error(handleErrorMessage(error));
    }
  }

  /**
   *
   * Create a new topic
   *
   * Note: The userID will be handled within the method itself
   *
   * @param userId The ID of the currently logged in user that is creating the topic
   * @param name The name of the topic
   *
   */
  async create(userId: number, name: string) {
    try {
      await db.insert(schemaTopics).values({
        name,
        slug: this.generateUniqueTopicSlug(name),
        created_by: userId,
      });

      console.log("TOPICS - Topic created successfully!");
    } catch (error) {
      console.log(
        `TOPICS - Failed creating topic: ${handleErrorMessage(error)}`
      );
      throw new Error(handleErrorMessage(error));
    }
  }

  /**
   *
   * Update the name of an existing topic
   *
   * Note: This will be removed, topics will be unique and no changes can be made to them
   *
   */
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

      // If topic does not exist
      if (!targetedTopic[0]) {
        throw new Error(ApiErrorMessage.NOT_FOUND);
      }

      // Only allow the user that created the topic (or an admin) to update it
      if (
        targetedTopic[0].created_by !== userID ||
        roleID !== UserRoles.ADMIN
      ) {
        throw new Error(ApiErrorMessage.UNAUTHORIZED);
      }

      // Update the name of the topic
      await db
        .update(schemaTopics)
        .set({ name })
        .where(eq(schemaTopics.id, id));

      console.log(
        `TOPICS - Successfully updated the name of topic with ID ${id}.`
      );
    } catch (error) {
      console.log(
        `TOPICS - Failed updating topic with ID ${id}: ${handleErrorMessage(
          error
        )}`
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
      // TODO: Check for topic existance first (?)
      await db.delete(schemaTopics).where(eq(schemaTopics.id, id));
      console.log(`TOPICS - Successfully updated topic with ID ${id}`);
    } catch (error) {
      console.log(
        `TOPICS - Failed deleting topic: ${handleErrorMessage(error)}`
      );
      throw new Error(handleErrorMessage(error));
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
      console.log(`TOPICS - Successfully removed ${ids.length} topics!`);
    } catch (error) {
      console.log(
        `TOPICS - Failed bulk topics deletion: ${handleErrorMessage(error)}`
      );
      throw new Error(handleErrorMessage(error));
    }
  }
}

const TopicsService = new Topics();

export default TopicsService;
