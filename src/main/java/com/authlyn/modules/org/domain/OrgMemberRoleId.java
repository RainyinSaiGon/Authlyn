package com.authlyn.modules.org.domain;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class OrgMemberRoleId implements Serializable {

    @Column(name = "org_member_id", nullable = false)
    private UUID orgMemberId;

    @Column(name = "role_id", nullable = false)
    private UUID roleId;

    public OrgMemberRoleId() {}

    public OrgMemberRoleId(UUID orgMemberId, UUID roleId) {
        this.orgMemberId = orgMemberId;
        this.roleId = roleId;
    }

    public UUID getOrgMemberId() { return orgMemberId; }
    public void setOrgMemberId(UUID orgMemberId) { this.orgMemberId = orgMemberId; }

    public UUID getRoleId() { return roleId; }
    public void setRoleId(UUID roleId) { this.roleId = roleId; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof OrgMemberRoleId other)) return false;
        return Objects.equals(orgMemberId, other.orgMemberId) && Objects.equals(roleId, other.roleId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(orgMemberId, roleId);
    }
}
