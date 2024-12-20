import { supabase } from "./supabase";

export async function authenticateUser(login_or_email, password) {
  try {
    const { data, error } = await supabase.rpc("authenticate_user", {
      login_or_email: login_or_email,
      p_password: password,
    });
    if (error) throw error;
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function authenticateCompany(login_or_email, password) {
  try {
    const { data, error } = await supabase.rpc("authenticate_company", {
      login_or_email: login_or_email,
      p_password: password,
    });
    if (error) throw error;
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function signup(
  email,
  password,
  username,
  isCompanyOrUser,
  about = ""
) {
  try {
    if (!isCompanyOrUser) {
      const { error } = await supabase.rpc("register_user", {
        p_email: email,
        p_password: password,
        p_username: username,
      });
      if (error) throw error;
    } else {
      const { error } = await supabase.rpc("register_company", {
        p_username: username,
        p_password: password,
        p_email: email,
        p_about: about,
      });
      if (error) throw error;
    }
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function addProject(projectDataJson, companyId) {
  try {
    const { data, error } = await supabase.rpc("add_project", {
      p_project_data: projectDataJson,
      p_company_id: companyId,
    });
    if (error) throw error;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function fetchProjects() {
  const { data, error } = await supabase.rpc("fetch_projects");

  if (error) throw error;
  return data;
}

export async function uploadImageToSupabase(file, fileName) {
  const uniqueFileName = `${Date.now()}-${fileName}`;
  const { data, error } = await supabase.storage
    .from("images")
    .upload(`images/${uniqueFileName}`, file, {
      cacheControl: "3600",
      upsert: false,
    });
  console.log(data);
  if (error) {
    console.error("Error uploading image:", error);
    return null;
  }
  const { data: publicData, error: urlError } = await supabase.storage
    .from("images")
    .getPublicUrl(`images/${uniqueFileName}`);
  if (urlError) {
    console.error("Error getting public URL:", urlError);
    return null;
  }
  return publicData.publicUrl;
}

export async function deleteImageFromSupabase(imageUrl) {
  const urlParts = imageUrl.split("/");
  const bucketName = "images";
  const bucketIndex = urlParts.indexOf(bucketName);
  if (bucketIndex === -1) {
    console.error("Bucket name not found in URL");
    return false;
  }

  const filePath = urlParts.slice(bucketIndex + 1).join("/");

  const { data, error } = await supabase.storage
    .from(bucketName)
    .remove([filePath]);

  if (error) {
    console.error("Error deleting image:", error);
    return false;
  }

  console.log("Image deleted successfully:", data);
  return true;
}
export async function uploadProfileIcon(file, userId, type) {
  console.log(file);
  const filePath = `${Date.now()}_${file.name}`;
  try {
    const { data, error } = await supabase.storage
      .from("profile_icons")
      .upload(filePath, file, {
        contentType: file.type,
        cacheControl: "3600",
        metadata: { user_id: String(userId) },
      });

    if (error) {
      throw new Error(error.message);
    }
    const newFilePath = `https://ktgmzsriglttmczagbfc.supabase.co/storage/v1/object/profile_icons/${data.path}`;
    const { error: updateError } = await supabase.rpc(
      "add_users_profile_icon",
      {
        p_user_id: userId,
        p_path: newFilePath,
        p_role: type,
      }
    );

    if (updateError) {
      throw new Error(error.message);
    }

    return newFilePath;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function fetchProject(projectId) {
  const { data, error } = await supabase.rpc("fetch_project", {
    p_project_id: projectId,
  });

  if (error) throw error;
  return data;
}

export async function searchProjects(searchQuery) {
  const { data, error } = await supabase.rpc("search_projects", {
    p_search_query: searchQuery,
  });

  if (error) {
    console.error("Error fetching projects:", error);
  } else {
    return data;
  }
}

export async function updateCompanyDescription(companyId, description) {
  try {
    const { data, error } = await supabase.rpc("update_description", {
      p_company_id: companyId,
      p_description: description,
    });
    if (error) throw error;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function changeUsersPassword(userId, pswd) {
  try {
    const { error } = await supabase.rpc("update_user_password", {
      p_user_id: userId,
      p_password: pswd,
    });
    if (error) throw error;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function changeUsersName(userId, name) {
  try {
    const { error } = await supabase.rpc("update_username", {
      p_user_id: userId,
      p_name: name,
    });
    if (error) throw error;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function addLikeToProject(projectId, userId) {
  try {
    const { error } = await supabase.rpc("add_rating_to_project", {
      p_project_id: projectId,
      p_user_id: userId,
    });
    if (error) throw error;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function addLikeToCompany(companyId, userId) {
  try {
    const { data, error } = await supabase.rpc("add_rating_to_company", {
      p_company_id: companyId,
      p_user_id: userId,
    });
    if (error) throw error;
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function fetchLikesForProject(projectId) {
  try {
    const { data, error } = await supabase.rpc("fetch_project_ratings", {
      p_project_id: projectId,
    });
    if (error) throw error;
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function fetchLikesForCompany(companyId) {
  try {
    const { data, error } = await supabase.rpc("fetch_company_ratings", {
      p_company_id: companyId,
    });
    if (error) throw error;
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function fetchCompanyInfo(companyId) {
  try {
    const { data, error } = await supabase.rpc("fetch_company", {
      p_company_id: companyId,
    });
    if (error) throw error;
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function fetchCompanyProjects(companyId) {
  try {
    const { data, error } = await supabase.rpc("fetch_company_projects", {
      p_company_id: companyId,
    });
    if (error) throw error;
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
}
