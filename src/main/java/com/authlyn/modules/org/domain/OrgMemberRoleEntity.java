package com.authlyn.modules.org.domain;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "org_member_roles")
public class OrgMemberRoleEntity {

    @EmbeddedId
    private OrgMemberRoleId id;

    @Column(name = "granted_at", nullable = false, updatable = false)
    private Instant grantedAt;

    public OrgMemberRoleId getId() { return id; }
    public void setId(OrgMemberRoleId id) { this.id = id; }

    public Instant getGrantedAt() { return grantedAt; }
    public void setGrantedAt(Instant grantedAt) { this.grantedAt = grantedAt; }
}
