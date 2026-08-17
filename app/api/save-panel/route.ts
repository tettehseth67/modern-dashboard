import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

// Dynamic File Writer Matrix Engine
async function writeComponentToDisk(folder: string, codeString: string) {
    if (!codeString || codeString.trim().length === 0) {
        throw new Error("Received an empty or invalid component code payload string.")
    }

    // Anchor the path layout directly to your physical project folder root
    const targetDirectory = path.join(process.cwd(), "app", folder)
    const targetFilePath = path.join(targetDirectory, "page.tsx")

    // Generate directory paths automatically if they're missing from your drive
    if (!fs.existsSync(targetDirectory)) {
        fs.mkdirSync(targetDirectory, { recursive: true })
    }

    // Drop the pristine component code text right onto your disk drive
    fs.writeFileSync(targetFilePath, codeString, "utf8")
    console.log(`🏁 SUCCESS AUTOMATION: Created app/${folder}/page.tsx successfully!`)
    return targetFilePath
}

// 1. THE POST ENDPOINT: Catches automated code drops coming from your cloud n8n node proxy
export async function POST(request: Request) {
    try {
        const rawData = await request.text()

        // Fallback parser: Check if incoming data is raw text code or a wrapped JSON object block
        let code = rawData
        let folder = "teachers" // default fallback

        try {
            const parsedJson = JSON.parse(rawData)
            if (parsedJson.code || parsedJson.output || parsedJson.text) {
                code = parsedJson.code || parsedJson.output || parsedJson.text
                folder = parsedJson.folder || parsedJson.table_name || "teachers"
            }
        } catch {
            // Incoming data is pure raw text string code, proceed safely
        }

        await writeComponentToDisk(folder, code)
        return NextResponse.json({ success: true, message: `Automated panel folder /${folder} built safely!` })

    } catch (error: any) {
        console.error("❌ POST AUTOMATION FAILURE:", error.message)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}

// 2. THE GET ENDPOINT: Allows you to manually trigger builds via your browser bar parameters
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const targetFolder = searchParams.get("table") || "teachers"
    const payloadRequest = searchParams.get("request") || "Teacher directory grid with employee email headers and department tags"

    try {
        console.log(`🤖 SERVER FETCH TRIGGERED FOR: /${targetFolder}`)

        const n8nResponse = await fetch("https://yaw0869.app.n8n.cloud/webhook-test/generate-panel", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Bypass-Tunnel-Reminder": "true"
            },
            body: JSON.stringify({
                panel_request: payloadRequest,
                table_name: targetFolder
            })
        })

        if (!n8nResponse.ok) throw new Error(`n8n Cloud returned status code: ${n8nResponse.status}`)

        const codePayload = await n8nResponse.text()
        await writeComponentToDisk(targetFolder, codePayload)

        return NextResponse.json({
            success: true,
            message: `Panel folder /${targetFolder} generated safely on your hard drive!`,
            view_url: `http://localhost:3000/${targetFolder}`
        })

    } catch (error: any) {
        console.error("❌ GET AUTOMATION FAILURE:", error.message)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
