import { mutation } from "./_generated/server"
import { v } from "convex/values"
import bcrypt from "bcryptjs"

const initialTasks = [
    "Buy groceries",
    "Finish React Native tutorial",
    "Clean the kitchen",
    "Call mom",
    "Schedule dentist appointment",
    "Fix bug in todo app",
    "Read 10 pages of a book",
    "Go for a 20-minute run",
    "Organize desk",
    "Meditate for 5 minutes"
]

export const login = mutation({
    args: {
        email: v.string(),
        password: v.string()
    },
    handler: async (ctx, args) => {
        const email = args.email.trim().toLowerCase()

        const user = await ctx.db.query("users")
            .withIndex("by_email", (q) => q.eq("email", email))
            .unique();

        if (!user) {
            return { success: false, message: "User not found!" }
        }

        const passwordCorrect = bcrypt.compareSync(args.password, user.password)

        if (!passwordCorrect) {
            return { success: false, message: "Invalid credentials!" }
        }

        return {
            success: true,
            userId: user._id
        }
    }
})

export const register = mutation({
    args: {
        fullName: v.string(),
        email: v.string(),
        password: v.string()
    },
    handler: async (ctx, args) => {
        const fullName = args.fullName.trim()
        const email = args.email.trim().toLowerCase()

        const user = await ctx.db.query("users")
            .withIndex("by_email", (q) => q.eq("email", email))
            .unique();

        if (user) {
            return { success: false, message: "User already exists!" }
        }

        const hashedPassword = bcrypt.hashSync(args.password, 10);

        const userId = await ctx.db.insert("users", {
            fullName,
            email,
            password: hashedPassword
        });

        for (const taskText of initialTasks) {
            await ctx.db.insert("todos", {
                text: taskText,
                isCompleted: Math.random() > 0.7,
                userId
            });
        }

        return userId;
    }
})
