import fs from 'fs';

let content = fs.readFileSync('src/app/app/organization/page.tsx', 'utf8');

// The faulty query
const oldQuery = \
    // 2. Get All Members of this Organization
    const { data: members } = await supabase
      .from('organization_members')
      .select(\\\
        id,
        email,
        role,
        status,
        created_at,
        user_id,
        profiles (
          full_name,
          avatar_url
        )
      \\\)
      .eq('organization_id', organization.id)
      .order('created_at', { ascending: false });
\;

const newQuery = \
    // 2. Get All Members of this Organization
    const { data: rawMembers, error: membersError } = await supabase
      .from('organization_members')
      .select(\\\
        id,
        email,
        role,
        status,
        created_at,
        user_id
      \\\)
      .eq('organization_id', organization.id)
      .order('created_at', { ascending: false });

    if (membersError) {
        console.error("Fetch members error:", membersError);
    }
      
    let members = rawMembers || [];

    // Manually fetch profiles for members who have a user_id
    const userIds = members.filter(m => m.user_id).map(m => m.user_id);
    if (userIds.length > 0) {
        const { data: profiles } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url')
            .in('id', userIds);
            
        if (profiles) {
            members = members.map(m => {
                const profile = profiles.find(p => p.id === m.user_id);
                return {
                    ...m,
                    profiles: profile ? { full_name: profile.full_name, avatar_url: profile.avatar_url } : null
                };
            });
        }
    }
\;

// Let's do a regex replace to be safe against whitespace
const queryRegex = /\/\/\s*2\.\s*Get All Members of this Organization\s*const\s*{\s*data:\s*members\s*}\s*=\s*await\s*supabase\s*\.from\('organization_members'\)[\s\S]*?\.order\('created_at',\s*{\s*ascending:\s*false\s*}\);/m;

if(queryRegex.test(content)) {
    content = content.replace(queryRegex, newQuery.trim());
    fs.writeFileSync('src/app/app/organization/page.tsx', content);
    console.log("Updated page.tsx!");
} else {
    console.log("Could not find the query!");
}
