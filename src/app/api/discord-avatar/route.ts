import { NextRequest, NextResponse } from 'next/server';

const DISCORD_API_BASE = 'https://discord.com/api/v10';

export async function GET(req: NextRequest) {
    const id = req.nextUrl.searchParams.get('id');
    if (!id || typeof id !== 'string') return NextResponse.json({ error: 'Missing or invalid user ID' }, { status: 400 });

    try {
        const discordRes = await fetch(`${DISCORD_API_BASE}/users/${id}`, {
            headers: {
                Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
            },
        });

        if (!discordRes.ok) {
            return NextResponse.json({ error: 'Failed to fetch user data from Discord' }, { status: discordRes.status });
        }

        const user = await discordRes.json();

        let avatarUrl: string;

        if (user.avatar) {
            const isAnimated = user.avatar.startsWith('a_');
            const ext = isAnimated ? 'gif' : 'webp';

            avatarUrl = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${ext}?size=1024`;
    
        } else return NextResponse.json({ error: 'Failed to fetch user avatar from Discord' }, { status: 502 });

        return NextResponse.json({
            id: user.id,
            avatar: avatarUrl,
            animated: Boolean(user.avatar?.startsWith('a_')),
        }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}